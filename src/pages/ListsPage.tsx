import React, { useState } from 'react';
import { List, Plus, Edit3, Trash2, Check, X, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ListItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoList {
  id: string;
  name: string;
  type: 'shopping' | 'todo' | 'custom';
  items: ListItem[];
}

const ListsPage = () => {
  const [lists, setLists] = useState<TodoList[]>([
    {
      id: '1',
      name: 'Weekly Shopping',
      type: 'shopping',
      items: [
        { id: '1', text: 'Milk', completed: false },
        { id: '2', text: 'Bread', completed: true },
        { id: '3', text: 'Eggs', completed: false }
      ]
    },
    {
      id: '2',
      name: 'Home Tasks',
      type: 'todo',
      items: [
        { id: '4', text: 'Fix kitchen faucet', completed: false },
        { id: '5', text: 'Clean garage', completed: false }
      ]
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<TodoList | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListType, setNewListType] = useState<'shopping' | 'todo' | 'custom'>('custom');
  const [newItemText, setNewItemText] = useState('');

  const handleCreateList = () => {
    if (newListName.trim()) {
      const newList: TodoList = {
        id: Date.now().toString(),
        name: newListName,
        type: newListType,
        items: []
      };
      setLists([...lists, newList]);
      setNewListName('');
      setIsDialogOpen(false);
    }
  };

  const handleDeleteList = (listId: string) => {
    setLists(lists.filter(list => list.id !== listId));
  };

  const handleAddItem = (listId: string) => {
    if (newItemText.trim()) {
      setLists(lists.map(list => {
        if (list.id === listId) {
          const newItem: ListItem = {
            id: Date.now().toString(),
            text: newItemText,
            completed: false
          };
          return { ...list, items: [...list.items, newItem] };
        }
        return list;
      }));
      setNewItemText('');
    }
  };

  const handleToggleItem = (listId: string, itemId: string) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return list;
    }));
  };

  const handleDeleteItem = (listId: string, itemId: string) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return { ...list, items: list.items.filter(item => item.id !== itemId) };
      }
      return list;
    }));
  };

  const getListIcon = (type: string) => {
    switch (type) {
      case 'shopping': return '🛒';
      case 'todo': return '✅';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link to="/" className="p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 flex items-center justify-center">
                  <Home className="w-6 h-6" />
                  <span className="sr-only">Home</span>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white">Lists & Tasks</h1>
                  <p className="text-blue-200">Manage your to-do lists and tasks</p>
                </div>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleCreateList} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New List
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      {editingList ? 'Edit List' : 'Create New List'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="List name"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <select
                      value={newListType}
                      onChange={(e) => setNewListType(e.target.value as 'shopping' | 'todo' | 'custom')}
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                    >
                      <option value="custom">Custom List</option>
                      <option value="shopping">Shopping List</option>
                      <option value="todo">Todo List</option>
                    </select>
                    <Button onClick={handleCreateList} className="w-full bg-blue-600 hover:bg-blue-700">
                      {editingList ? 'Update List' : 'Create List'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {/* Lists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <Card key={list.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-white text-lg flex items-center">
                    <span className="mr-2">{getListIcon(list.type)}</span>
                    {list.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteList(list.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {list.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2 group">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleItem(list.id, item.id)}
                          className={`p-1 ${item.completed ? 'text-green-400' : 'text-gray-400'}`}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                          {item.text}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(list.id, item.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add new item..."
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddItem(list.id);
                        }
                      }}
                      className="bg-slate-700/50 border-slate-600 text-white text-sm"
                    />
                    <Button
                      onClick={() => handleAddItem(list.id)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListsPage;
