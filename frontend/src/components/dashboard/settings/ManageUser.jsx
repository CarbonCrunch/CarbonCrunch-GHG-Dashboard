import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import NavbarD from "../NavbarD";
import { useAuth } from "../../../context/AuthContext";
import { FiTrash2, FiEdit2, FiPlus, FiCheck } from "react-icons/fi"; // Import React Icons
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageUser = () => {
  const { user } = useAuth();
  const [companyUsers, setCompanyUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for add modal
  const [editingPermission, setEditingPermission] = useState(null); // Track which permission is being edited
  const [editPermissions, setEditPermissions] = useState([]); // To manage permissions while editing
  const [deleteUserCompletely, setDeleteUserCompletely] = useState(false); // To manage if user should be deleted completely
  const [newPermission, setNewPermission] = useState({}); // State for new permission entity
  const [selectedFacility, setSelectedFacility] = useState(null);

  // List of all possible entities
  const allEntities = [
    "fuel",
    "bioenergy",
    "food",
    "refrigerants",
    "ehctd",
    "wttfuel",
    "material",
    "waste",
    "btls",
    "ec",
    "water",
    "fg",
    "homeOffice",
    "ownedVehicles",
    "fa",
    "Bill",
    "Role",
    "Facility",
    "dtd",
    "utd",
    "ula",
  ];

  useEffect(() => {
    const fetchCompanyUsers = async () => {
      try {
        if (user && user.companyName) {
          const response = await axios.get("/api/users/getCompanyUsers", {
            params: { companyName: user.companyName },
            headers: {
              Authorization: `Bearer ${user.accessToken}`, // Include accessToken in the headers
            },
            withCredentials: true, // Ensure cookies are sent with the request
          });

          setCompanyUsers(response.data.data); // Store the users in state
          console.log("companyUsers", companyUsers);
        }
      } catch (error) {
        console.error("Error fetching company users:", error);
      }
    };

    fetchCompanyUsers();
  }, [user]);

  // Function to handle opening the view/edit permissions modal
  const handleAccessClick = (user, facility) => {
    setSelectedUser(user);
    setSelectedFacility(facility);
    setIsModalOpen(true);
  };

  // Function to handle opening the edit permissions modal
  const handleEditPermissionClick = (permission) => {
    setEditingPermission(permission);
    setEditPermissions(permission.actions);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
    setEditingPermission(null); // Reset editing state
  };

  const handleSavePermissions = async () => {
    try {
      console.log("permissions1", editPermissions);
      // Filter out only the valid permissions to send
      const permissionsToSend = editPermissions
        .filter(({ entity, actions, flag }) => entity && flag) // Ensure 'entity' and 'flag' are present
        .map(({ entity, actions, flag }) => ({
          entity,
          actions:
            actions.length > 0
              ? actions.map(({ name, status }) => ({ name, status }))
              : [], // Handle both cases for actions
          flag,
        }))
        .filter(({ actions, flag }) => flag === "delete" || actions.length > 0); // Ensure actions are included if they have content or flag is 'delete'

      console.log(
        "permissions2",
        // permissionsToSend,
        // selectedUser._id,
        // selectedUser.username, // Add username to the request body
        // selectedFacility.facilityName // Add facilityName to the request body
      );

      await axios.patch(
        "/api/users/updateUserPermission",
        {
          userId: selectedUser._id,
          username: selectedUser.username, // Add username to the request body
          facilityName: selectedFacility.facilityName, // Add facilityName to the request body
          permissions: permissionsToSend,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Include accessToken in the headers
          },
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );

      toast.success("Permissions updated successfully!", {
        position: "top-right",
      }); // Show success notification

      setSelectedUser((prevSelectedUser) => ({
        ...prevSelectedUser,
        facilities: prevSelectedUser.facilities.map((facility) => ({
          ...facility,
          userRoles: facility.userRoles.map((role) => ({
            ...role,
            permissions: [
              ...role.permissions,
              ...editPermissions
                .filter(({ flag }) => flag === "add")
                .map(({ entity, actions }) => ({
                  entity,
                  actions: actions.map((action) => action.name),
                })),
            ],
          })),
        })),
      }));

      // Clear the editing states
      setEditingPermission(null);
      setEditPermissions([]); // Clear edit permissions state
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error updating permissions:", error);

      toast.error("Failed to update permissions. Please try again.", {
        position: "top-right",
      }); // Show error notification
    }
  };

  const handleDeleteUserPermission = async () => {
    if (deleteUserCompletely) {
      if (
        window.confirm(
          "Are you sure you want to delete this user completely from the facility?"
        )
      ) {
        try {
          await axios.delete("/api/users/deleteUserPermission", {
            data: {
              username: selectedUser.username,
              userId: selectedUser._id,
              facilityName: selectedUser.facilities[0].facilityName,
            }, // Send required data to delete
            headers: {
              Authorization: `Bearer ${user.accessToken}`, // Include accessToken in headers
            },
            withCredentials: true, // Ensure cookies are sent
          });

          setCompanyUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== selectedUser._id)
          );

          toast.success("User deleted successfully!", {
            position: "top-right",
          });

          handleCloseModal(); // Close modal after deletion
        } catch (error) {
          console.error("Error deleting user:", error);

          toast.error("Failed to delete user. Please try again.", {
            position: "top-right",
          });
        }
      }
    } else {
      handleSavePermissions();
    }
  };

  // const handlePermissionChange = (action) => {
  //   // Update action to 'off' and add to editPermissions with 'update' flag
  //   setEditPermissions((prevPermissions) => {
  //     const updatedPermissions = prevPermissions.map((perm) => {
  //       if (perm.entity === editingPermission.entity) {
  //         return {
  //           ...perm,
  //           actions: perm.actions
  //             .map((a) => (a === action ? { name: a, status: "off" } : a))
  //             .filter((a) => a.name !== action), // Remove action from the list immediately
  //           flag: "update",
  //         };
  //       }
  //       return perm;
  //     });

  //     return updatedPermissions;
  //   });

  //   // Show toast notification
  //   toast.info("Click 'Save Changes' to apply action updates.", {
  //     position: "top-right",
  //   });
  // };

  const handleDeleteIconClick = (entity) => {
    // Notify user to click save changes to apply
    toast.info("Click 'Save Changes' to apply deletion.", {
      position: "top-right",
    });

    setEditPermissions((prevPermissions) => {
      const updatedPermissions = [
        ...prevPermissions,
        { entity, actions: [], flag: "delete" },
      ];
      console.log("EP after update:", updatedPermissions); // Log after updating
      return updatedPermissions;
    });

    setSelectedUser((prevSelectedUser) => ({
      ...prevSelectedUser,
      facilities: prevSelectedUser.facilities.map((facility) => ({
        ...facility,
        userRoles: facility.userRoles.map((role) => ({
          ...role,
          permissions: role.permissions.filter(
            (perm) => perm.entity !== entity
          ),
        })),
      })),
    }));
  };

  const handleAddPermissionClick = (entity) => {
    setNewPermission({ entity, actions: [] });
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setNewPermission({});
    setIsAddModalOpen(false);
  };

  // const handleAddNewPermission = (action) => {
  //   setNewPermission((prev) => ({
  //     ...prev,
  //     actions: [...prev.actions, action],
  //   }));
  // };

  // Function to handle removing actions
  const handleRemoveNewPermission = (action) => {
    setNewPermission((prev) => ({
      ...prev,
      actions: prev.actions.filter((a) => a !== action), // Remove the selected action
    }));
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <NavbarD />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/6 flex-shrink-0 sticky top-0 h-screen">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-grow p-8">
          <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

          {/* Display users grouped by facilityName */}
          {companyUsers.length > 0 ? (
            companyUsers.map((user) =>
              user.facilities.map((facility) => (
                <div key={facility.facilityName} className="mt-4">
                  <h3 className="text-xl font-semibold">
                    Facility: {facility.facilityName}
                  </h3>
                  <div className="mt-2 flex items-center">
                    {" "}
                    User Name:
                    <p
                      className="inline-block mr-2 cursor-pointer text-blue-500 hover:underline"
                      onClick={() => handleAccessClick(user, facility)} // Pass facility here
                    >
                      {user.username}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : (
            <p>No users found for this company.</p>
          )}
        </div>
      </div>
      {/* Modal for showing and editing user permissions */}
      {isModalOpen && selectedUser && selectedFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-hidden">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[80vh] overflow-y-scroll scrollbar-hide">
            <h3 className="text-xl font-bold mb-4">
              Permissions for {selectedUser.username} in{" "}
              {selectedFacility.facilityName}
            </h3>
            <div className="space-y-2">
              {/* Map over the userRoles for the selected facility */}
              {selectedFacility.userRoles.map((role) =>
                role.permissions.map((perm, index) => (
                  <div
                    key={index}
                    className="border-b pb-2 mb-2 flex items-center"
                  >
                    <p className="font-semibold flex-1">{perm.entity}</p>
                    <div className="flex space-x-2">
                      {perm.actions
                        .filter((action) => action !== "") // Only show non-empty actions
                        .map((action) => (
                          <span
                            key={action}
                            className="text-xs bg-gray-200 rounded-full px-2 py-1"
                          >
                            {action}
                          </span>
                        ))}
                    </div>
                    <FiEdit2
                      className="ml-2 cursor-pointer text-gray-600 hover:text-black"
                      onClick={() => handleEditPermissionClick(perm)}
                    />
                    <FiTrash2
                      className="ml-2 cursor-pointer text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteIconClick(perm.entity)}
                    />
                  </div>
                ))
              )}

              {/* Display missing entities with a '+' icon */}
              {allEntities
                .filter(
                  (entity) =>
                    !selectedFacility.userRoles[0].permissions.some(
                      (perm) => perm.entity === entity
                    )
                )
                .map((missingEntity) => (
                  <div
                    key={missingEntity}
                    className="border-b pb-2 mb-2 flex items-center"
                  >
                    <p className="font-semibold flex-1">{missingEntity}</p>
                    <FiPlus
                      className="ml-2 cursor-pointer text-green-600 hover:text-green-800"
                      onClick={() => handleAddPermissionClick(missingEntity)}
                    />
                  </div>
                ))}
            </div>
            <button
              className="ml-2 mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={handleSavePermissions}
            >
              Save Changes
            </button>
            <button
              className="ml-2 mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal for adding new permissions */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/3 max-h-[60vh] overflow-hidden">
            <h3 className="text-lg font-bold mb-4">
              Add Actions for {newPermission.entity}
            </h3>
            <div className="space-y-2">
              {["read", "create", "update", "delete"].map((action) => (
                <div key={action} className="flex items-center justify-between">
                  <span className="text-sm">{action}</span>
                  {newPermission.actions.includes(action) ? (
                    <FiCheck
                      className="ml-2 cursor-pointer text-green-600 hover:text-green-800"
                      onClick={() => handleRemoveNewPermission(action)}
                    />
                  ) : (
                    <FiPlus
                      className="ml-2 cursor-pointer text-green-600 hover:text-green-800"
                      onClick={() => {
                        // Add action to newPermission
                        setNewPermission((prev) => ({
                          ...prev,
                          actions: [...prev.actions, action],
                        }));

                        // Update editPermissions state
                        setEditPermissions((prevPermissions) => {
                          const existingPermissionIndex =
                            prevPermissions.findIndex(
                              (perm) => perm.entity === newPermission.entity
                            );

                          if (existingPermissionIndex !== -1) {
                            const updatedPermissions = [...prevPermissions];
                            const existingActions =
                              updatedPermissions[existingPermissionIndex]
                                .actions;

                            // Check if action already exists
                            if (
                              !existingActions.some((a) => a.name === action)
                            ) {
                              existingActions.push({
                                name: action,
                                status: "on",
                              });
                            }
                            return updatedPermissions;
                          } else {
                            return [
                              ...prevPermissions,
                              {
                                entity: newPermission.entity,
                                actions: [{ name: action, status: "on" }],
                                flag: "add",
                              },
                            ];
                          }
                        });

                        toast.info("Click 'Save' to apply changes.", {
                          position: "top-right",
                        });
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={handleSavePermissions} // Call handleSavePermissions directly
              >
                Save
              </button>
              <button
                className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                onClick={handleCloseAddModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Second overlay for editing individual permissions */}
      {editingPermission && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/3 max-h-[60vh] overflow-hidden">
            <h3 className="text-lg font-bold mb-4">
              Edit Actions for {editingPermission.entity}
            </h3>
            <div className="space-y-2">
              {/* Show existing actions with the trash icon to remove them */}
              {["read", "create", "update", "delete", "manage"].map(
                (action) => {
                  if (
                    action === "manage" &&
                    !["Facility", "Role"].includes(editingPermission.entity)
                  ) {
                    return null; // Skip rendering the "manage" action for entities other than "Facility" and "Role"
                  }

                  return (
                    <div
                      key={action}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{action}</span>
                      {editingPermission.actions.includes(action) ? (
                        <FiTrash2
                          className="ml-2 cursor-pointer text-red-600 hover:text-red-800"
                          onClick={() => {
                            // Remove the action from the UI
                            setEditingPermission((prev) => ({
                              ...prev,
                              actions: prev.actions.filter((a) => a !== action),
                            }));

                            // Add the action with a flag 'update' to the editPermissions state
                            setEditPermissions((prevPermissions) => [
                              ...prevPermissions.filter(
                                (perm) =>
                                  perm.entity !== editingPermission.entity
                              ),
                              {
                                entity: editingPermission.entity,
                                actions: [{ name: action, status: "off" }],
                                flag: "update",
                              },
                            ]);

                            toast.info("Click 'Save' to apply changes.", {
                              position: "top-right",
                            });
                          }}
                        />
                      ) : (
                        <FiPlus
                          className="ml-2 cursor-pointer text-green-600 hover:text-green-800"
                          onClick={() => {
                            // Add action to newPermission
                            setEditingPermission((prev) => ({
                              ...prev,
                              actions: [...prev.actions, action],
                            }));

                            // Update editPermissions state
                            setEditPermissions((prevPermissions) => {
                              const existingPermissionIndex =
                                prevPermissions.findIndex(
                                  (perm) =>
                                    perm.entity === editingPermission.entity
                                );

                              if (existingPermissionIndex !== -1) {
                                const updatedPermissions = [...prevPermissions];
                                const existingActions =
                                  updatedPermissions[existingPermissionIndex]
                                    .actions;

                                // Check if action already exists
                                if (
                                  !existingActions.some(
                                    (a) => a.name === action
                                  )
                                ) {
                                  existingActions.push({
                                    name: action,
                                    status: "on",
                                  });
                                }
                                return updatedPermissions;
                              } else {
                                return [
                                  ...prevPermissions,
                                  {
                                    entity: editingPermission.entity,
                                    actions: [{ name: action, status: "on" }],
                                    flag: "add",
                                  },
                                ];
                              }
                            });

                            toast.info("Click 'Save' to apply changes.", {
                              position: "top-right",
                            });
                          }}
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={handleSavePermissions}
              >
                Save
              </button>
              <button
                className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                onClick={() => setEditingPermission(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ManageUser;
