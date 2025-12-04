import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const DashboardDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data
  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+8%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Growth',
      value: '23.5%',
      change: '-2%',
      changeType: 'negative',
      icon: TrendingUp,
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      change: '+5%',
      changeType: 'positive',
      icon: Activity,
    },
  ];

  const tableData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2 hours ago',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'Active', 
      lastLogin: '1 day ago',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'User',
      status: 'Inactive',
      lastLogin: '1 week ago',
    },
  ];

  return (
    <DashboardLayout title="Dashboard Overview">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} hover className="relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-50 p-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Actions Bar */}
        <Card>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <Input
                placeholder="Search users..."
                icon={Search}
                className="sm:w-64"
              />
              <Button variant="outline" icon={Filter}>
                Filter
              </Button>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" icon={Download}>
                Export
              </Button>
              <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                Add User
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Table */}
        <Card padding="p-0">
          <Card.Header className="px-6 pt-6 pb-0">
            <Card.Title>Recent Users</Card.Title>
          </Card.Header>
          <Card.Content className="px-6 pb-6">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Name</Table.Head>
                  <Table.Head>Email</Table.Head>
                  <Table.Head>Role</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Last Login</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tableData.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      <Badge variant={user.role === 'Admin' ? 'primary' : 'default'}>
                        {user.role}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant={user.status === 'Active' ? 'success' : 'warning'}>
                        {user.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-gray-500">{user.lastLogin}</Table.Cell>
                    <Table.Cell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" icon={Eye} />
                        <Button size="sm" variant="ghost" icon={Edit} />
                        <Button size="sm" variant="ghost" icon={Trash2} />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card.Content>
        </Card>

        {/* Chart Placeholder */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <Card.Header>
              <Card.Title>Analytics Overview</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="h-64 rounded-lg bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Chart Component Placeholder</p>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Recent Activity</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">User action performed</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Modal Example */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New User"
      >
        <Modal.Body>
          <div className="space-y-4">
            <Input label="Full Name" placeholder="Enter full name" />
            <Input label="Email" type="email" placeholder="Enter email address" />
            <Input label="Role" placeholder="Select role" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default DashboardDemo;