"use client";

import { GetAllOrders } from "@/app/APIs/routes";
import { Button, message, Table, TableProps, Tooltip, Tag, Space } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlineMailOutline, MdDownload, MdRefresh } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa";
import ReactTimeAgo from "react-time-ago";
import InitialPageloader from "@/app/components/initialPageloader";

interface InvoiceDataType {
  key: string;
  _id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  courseName: string;
  amount: string;
  status: string;
  createdAt: Date;
}

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<InvoiceDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await GetAllOrders();
      if (response.data.success) {
        const formattedData = response.data.data.map((order, index) => ({
          key: order._id,
          _id: order._id,
          invoiceNumber: `INV-${String(index + 1).padStart(4, '0')}`,
          customerName: order.userId?.name || 'N/A',
          customerEmail: order.userId?.email || 'N/A',
          courseName: order.courseId?.name || 'N/A',
          amount: order.courseId?.price || '0',
          status: 'Paid',
          createdAt: order.createdAt,
        }));
        setInvoices(formattedData);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || "Please check your internet connection"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleExportSelected = () => {
    const selectedData = invoices.filter(invoice => 
      selectedRowKeys.includes(invoice.key)
    );
    exportToCSV(selectedData, 'selected-invoices');
  };

  const handleExportAll = () => {
    exportToCSV(invoices, 'all-invoices');
  };

  const exportToCSV = (data: InvoiceDataType[], filename: string) => {
    const headers = [
      'Invoice Number',
      'Customer Name', 
      'Customer Email',
      'Course Name',
      'Amount ($)',
      'Status',
      'Date'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(invoice => [
        invoice.invoiceNumber,
        `"${invoice.customerName}"`,
        invoice.customerEmail,
        `"${invoice.courseName}"`,
        invoice.amount,
        invoice.status,
        new Date(invoice.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    messageApi.success(`Exported ${data.length} invoices successfully`);
  };

  const columns: TableProps<InvoiceDataType>['columns'] = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 120,
      render: (text) => (
        <span className="font-mono text-bprimary font-medium">{text}</span>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text, record) => (
        <div>
          <Tooltip title={text}>
            <div className="font-medium text-primary-light dark:text-primary-dark line-clamp-1 max-w-32">
              {text}
            </div>
          </Tooltip>
          <div className="text-xs text-muted-light dark:text-muted-dark line-clamp-1 max-w-32">
            {record.customerEmail}
          </div>
        </div>
      ),
    },
    {
      title: 'Course',
      dataIndex: 'courseName',
      key: 'courseName',
      render: (text) => (
        <Tooltip title={text}>
          <div className="max-w-40 line-clamp-2 text-sm">
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount) => (
        <span className="font-semibold text-success">
          ${amount === '0' ? 'Free' : amount}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color="success" className="font-medium">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => (
        <div>
          <div className="text-sm">
            {new Date(date).toLocaleDateString()}
          </div>
          <div className="text-xs text-muted-light dark:text-muted-dark">
            <ReactTimeAgo date={date} locale="en-US" />
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="Send Email">
            <Button
              type="text"
              size="small"
              icon={<MdOutlineMailOutline />}
              onClick={() => {
                window.location.href = `mailto:${record.customerEmail}?subject=Invoice ${record.invoiceNumber}&body=Dear ${record.customerName},%0D%0A%0D%0AThank you for your purchase of ${record.courseName}.`;
              }}
              className="text-bprimary hover:bg-bprimary/10"
            />
          </Tooltip>
          <Tooltip title="Download Invoice">
            <Button
              type="text"
              size="small"
              icon={<MdDownload />}
              onClick={() => exportToCSV([record], `invoice-${record.invoiceNumber}`)}
              className="text-success hover:bg-success/10"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    onSelectAll: (selected: boolean, selectedRows: InvoiceDataType[], changeRows: InvoiceDataType[]) => {
      if (selected) {
        setSelectedRowKeys(invoices.map(item => item.key));
      } else {
        setSelectedRowKeys([]);
      }
    },
  };

  if(loading){
    return <InitialPageloader />
  }

  return (
    <div className="space-y-6">
      {contextHolder}
      
      {/* Header */}
      <div className="flex items-start justify-between max-w-full overflow-x-auto pb-6 gap-2">
        <div className="flex items-start  gap-3">
          <FaFileInvoice className="text-2xl text-accent" />
          <div>
            <h1 className="text-title text-primary-light dark:text-primary-dark min-w-max">
              Invoices Management
            </h1>
            <p className="text-sm text-muted-light dark:text-muted-dark">
              Manage and export customer invoices
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            icon={<MdRefresh />}
            onClick={fetchInvoices}
            loading={loading}
            className="border-bprimary text-bprimary hover:bg-bprimary hover:text-white"
          >
            Refresh
          </Button>
          
          {selectedRowKeys.length > 0 && (
            <Button
              type="primary"
              icon={<MdDownload />}
              onClick={handleExportSelected}
              className="bg-success hover:bg-success/90 border-success"
            >
              Export Selected ({selectedRowKeys.length})
            </Button>
          )}
          
          <Button
            type="primary"
            icon={<MdDownload />}
            onClick={handleExportAll}
            className="bg-bprimary hover:bg-bprimary-hover"
          >
            Export All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4">
          <div className="text-2xl font-bold text-bprimary">{invoices.length}</div>
          <div className="text-sm text-muted-light dark:text-muted-dark">Total Invoices</div>
        </div>
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4">
          <div className="text-2xl font-bold text-success">
            ${invoices.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0).toFixed(2)}
          </div>
          <div className="text-sm text-muted-light dark:text-muted-dark">Total Revenue</div>
        </div>
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4">
          <div className="text-2xl font-bold text-success">{invoices.length}</div>
          <div className="text-sm text-muted-light dark:text-muted-dark">Paid Invoices</div>
        </div>
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4">
          <div className="text-2xl font-bold text-accent">
            ${(invoices.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0) / (invoices.length || 1)).toFixed(2)}
          </div>
          <div className="text-sm text-muted-light dark:text-muted-dark">Average Order</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg">
        <Table<InvoiceDataType>
          columns={columns}
          dataSource={invoices}
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            total: invoices.length,
            pageSize: 10,
            // showSizeChanger: true,
            showQuickJumper: true,
            
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} invoices`,
          }}
          scroll={{ x: 800 }}
          className="invoice-table"
        />
      </div>
    </div>
  );
};

export default InvoicesPage;
