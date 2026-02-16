"use client";

import {
  Button,
  message,
  Modal,
  Rate,
  Select,
  Table,
  TableProps,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import ReactTimeAgo from "react-time-ago";
import { DeleteUser, GetAllCoursesApi, GetAllUsers, UpdateRole } from "@/app/APIs/routes";
import {
  ICourseData,
  IUpdateUserRolePayload,
  IUser,
} from "@/app/types/apifn.types";
import { CourseData } from "@/app/data";
import { MdDeleteOutline, MdOutlineEmail } from "react-icons/md";
import axios from "axios";
import InitialPageloader from "@/app/components/initialPageloader";

try {
  TimeAgo.addDefaultLocale(en);
  TimeAgo.addLocale(ru);
} catch (error) {}

interface DataType {
  key: number;
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  courses: string[];
}
const page = () => {
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const [loading, setloading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [admins, setAdmins] = useState<IUser[]>([]);
  const [rowData, setRowData] = useState<DataType[]>([]);
  console.log('row data is',rowData)
  const [updateRoleModel, setUpdateRoleModel] = useState(false);
  const [changeRolePayload, setChangeRolePayload] =
    useState<IUpdateUserRolePayload>({ email: "", role: "" });
    console.log('paylaod is',changeRolePayload)
  const [messageApi, contextHolder] = message.useMessage();
  const [adminNominatedToDelete, setAdminNominatedToDelete] = useState<{email:string,_id:string}>({email:'',_id:''})
  const [deleteUserDialog, setDeleteUserDialog] = useState(false)

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        setloading(true)
        const res = await GetAllUsers();
        if (res.data.success) {
          setUsers(res.data.data);
          const admins = res.data.data.filter(
            (user, i) => user.role !== "user"
          );
          setAdmins(admins);
          const fieldsData = admins.map((item, i) => {
            return {
              key: i,
              _id: item._id,
              name: item.name,
              email: item.email,
              role: item.role,
              createdAt: item.createdAt,
              courses: item.courses,
            };
          });
          setRowData(fieldsData);
        }
      } catch (error) {
        if(axios.isAxiosError(error)){
          messageApi.error(error.response?.data?.message || 'Failed to fetch teams data' )
        }
      }
      finally {
        setloading(false)
      }
    };
    getAllUsers();
  }, []);

  // Create formatter (English).
  const columns: TableProps<DataType>["columns"] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "_id",
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      render: (text) => (
        <Tooltip title={text} className="cursor-pointer">
          <div className="max-w-36 overflow-x-hidden whitespace-nowrap text-ellipsis">
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "role",
      title: "Role",
      dataIndex: "role",
      render: (data) => (data ? <div>{data}</div> : <div>User</div>),
    },
    {
      key: "courses",
      title: "Enrolled Courses",
      dataIndex: "courses",
      render: (courses) =>
        courses.length > 0 ? (
          <div className="flex flex-col oveflow-y-auto">
            {courses.map((course: string, i: number) => {
              return <div key={i}>{course}</div>;
            })}
          </div>
        ) : (
          <div>Not enrolled yet</div>
        ),
    },
    {
      key: "createdAt",
      title: "Registered On",
      dataIndex: "createdAt",
      render: (date) => date && <ReactTimeAgo date={date} locale="en-US" />,
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, { email,_id }) => {
        return (
          <div className="flex gap-3">
            <MdDeleteOutline
              color="red"
              className="cursor-pointer "
              size={screenWidth < 768 ? 20 : 25}
              onClick={()=>{
                setDeleteUserDialog(true)
                setAdminNominatedToDelete({_id,email})
              }}
            />
            <a
              href={`mailto:${email}`}
              //   target="_blank"
            >
              <MdOutlineEmail
                color="green"
                className="cursor-pointer "
                size={screenWidth < 768 ? 20 : 25}
              />
            </a>
          </div>
        );
      },
    },
  ];

  if(loading){
    return <InitialPageloader />
  }

  const handleAddNewAdmin = async () => {
    try {
      setloading(true);
      const res = await UpdateRole(changeRolePayload);
      if (res.data.success) {
        messageApi.success('User Role upated successfully');
        setUpdateRoleModel(false);
        const admins = res.data.data.filter((user, i) => user.role !== "user");
        const fieldsData = admins.map((item, i) => {
          return {
            key: i,
            _id: item._id,
            name: item.name,
            email: item.email,
            role: item.role,
            createdAt: item.createdAt,
            courses: item.courses,
          };
        });
        setRowData(fieldsData);
        setAdmins(admins);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data.message ||
            "Something went wrong , Please try again later"
        );
      }
    } finally {
      setloading(false);
      setUpdateRoleModel(false);
    }
  };
  const handleDeleteUser = async () => {
    try {
      setloading(true);
      const res = await DeleteUser(adminNominatedToDelete._id);
      if (res.data.success) {
        messageApi.success('Deleted Successfully');
        setUpdateRoleModel(false);
        const admins = res.data.data.filter((user, i) => user.role !== "user");
        const fieldsData = admins.map((item, i) => {
          return {
            key: i,
            _id: item._id,
            name: item.name,
            email: item.email,
            role: item.role,
            createdAt: item.createdAt,
            courses: item.courses,
          };
        });
        setRowData(fieldsData);
        setAdmins(admins);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data.message ||
            "Something went wrong , Please try again later"
        );
      }
    } finally {
      setloading(false);
      setUpdateRoleModel(false);
    }
  };

  

  return (
    <div>
      <div className="w-full flex justify-end  mb-6">
        {
          contextHolder
        }
        <Button
          variant="filled"
          type="primary"
          onClick={() => setUpdateRoleModel(true)}
        >
          Add New Admin
        </Button>
      </div>
      <div className="w-full overflow-x-auto border border-border-light dark:border-border-dark">
        <Table<DataType>
          columns={columns}
          dataSource={rowData}
          classNames={{
            body: {
              wrapper: "w-full!  border-red-600! dark:bg-[#282727]",
              cell: "min-w-max! text-nowrap!",
            },
            header: {
              cell: "min-w-max! text-nowrap!",
            },
          }}
        />
      </div>
      <Modal
        open={updateRoleModel}
        onCancel={() => setUpdateRoleModel(false)}
        footer={false}
        closeIcon={true}
        title={
          <div className="text-title text-center">
            Update <span className="text-accent">Role</span>
          </div>
        }
        centered={true}
      >
        <div className="flex flex-col gap-y-4 w-full mt-2">
          <Select
            placeholder="Choose Email"
            onChange={(value) =>
              setChangeRolePayload((pre) => ({ ...pre, email: value }))
            }
            options={users.map((user, i) => ({
              label: user.email,
              value: user.email,
            }))}
            allowClear
          ></Select>
          <Select
            placeholder="Choose Role"
            onChange={(value) =>
              setChangeRolePayload((pre) => ({ ...pre, role: value }))
            }
            options={[
              { label: "User", value: "user" },
              { label: "Admin", value: "admin" },
            ]}
            allowClear
          ></Select>
          <div className="flex justify-end gap-x-4">
            <Button
              variant="outlined"
              onClick={() => setUpdateRoleModel(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              type="primary"
              loading={loading}
              icon
              iconPlacement={"end"}
              onClick={handleAddNewAdmin}
            >
              Update Role
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={deleteUserDialog}
        onCancel={() => setDeleteUserDialog(false)}
        footer={false}
        closeIcon={true}
        title={
          <div className="text-title text-center">
            Delete<span className="text-error"> User !</span>
          </div>
        }
        centered={true}
      >
        <div className="flex flex-col mt-4 w-full">
          <div className="text-center">

          Are you sure to delete selected user under the email:
          </div>
          <div className="text-center text-accent mb-6 mt-2">
            {adminNominatedToDelete?.email}
          </div>
          <div className="flex justify-end gap-x-4">
            <Button
              variant="outlined"
              onClick={() => setDeleteUserDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="red"
              loading={loading}
              icon
              iconPlacement={"end"}
              onClick={handleDeleteUser}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default page;
