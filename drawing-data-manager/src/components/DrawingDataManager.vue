<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Drawing Data Manager</h1>
      <p class="text-gray-600">Manage and correct data extracted from technical drawings</p>
    </div>

    <!-- Controls Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex flex-wrap gap-3">
          <button 
            @click="openAddModal" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add New Record
          </button>
          
          <!-- Export Dropdown -->
          <div class="relative" v-if="data.length > 0">
            <button 
              @click="showExportMenu = !showExportMenu"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              Export
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <div 
              v-if="showExportMenu" 
              class="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="py-1">
                <button 
                  @click="exportData('csv')" 
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as CSV
                </button>
                <button 
                  @click="exportData('xlsx')" 
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as Excel
                </button>
              </div>
            </div>
          </div>
          
          <!-- Import Button -->
          <div class="relative">
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileImport" 
              accept=".csv,.xlsx,.xls"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button 
              type="button"
              class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 11-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              Import Data
            </button>
          </div>
        </div>
        
        <div class="w-full md:w-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search records..."
              class="w-full md:w-80 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 text-sm shadow-sm"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Filters -->
    <div class="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-200">
      <div class="flex flex-wrap gap-3">
        <button
          v-for="status in statusFilters"
          :key="status.key"
          @click="toggleStatusFilter(status.key)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all shadow-sm',
            activeStatusFilters.includes(status.key) 
              ? status.activeClass 
              : status.inactiveClass
          ]"
        >
          <span class="w-3 h-3 rounded-full" :class="status.dotClass"></span>
          {{ status.label }}
          <span class="bg-white bg-opacity-20 text-xs rounded-full px-2 py-0.5 font-semibold">{{ getStatusCount(status.key) }}</span>
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200" ref="tableRef">
          <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th 
                v-for="column in columns" 
                :key="column.key"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-move hover:bg-blue-100 transition-colors"
                @mousedown="startColumnDrag"
                @mousemove="handleColumnDrag"
                @mouseup="endColumnDrag"
              >
                <div class="flex items-center justify-between">
                  <span>{{ column.label }}</span>
                  <button 
                    @click="toggleColumnVisibility(column.key)"
                    class="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Toggle visibility"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="(item, index) in filteredData" 
              :key="item.id"
              :class="{
                'bg-blue-50': item.status === 'new',
                'bg-yellow-50': item.status === 'modified',
                'bg-red-50': item.status === 'deleted',
                'bg-green-50': item.status === 'verified',
                'opacity-75': item.status === 'deleted',
                'animate-pulse': item.status === 'new' && item.isNew,
                'hover:bg-gray-50 transition-colors': true
              }"
              draggable="true"
              @dragstart="startRowDrag($event, index)"
              @dragover.prevent="dragOver($event, index)"
              @drop="drop($event, index)"
              @dragend="endRowDrag"
            >
              <td 
                v-for="column in visibleColumns" 
                :key="`${item.id}-${column.key}`"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                @click="startEditing(item, column.key)"
              >
                <div v-if="isEditing(item.id, column.key)" class="flex items-center">
                  <input
                    v-model="item[column.key]"
                    type="text"
                    class="border-2 border-blue-500 rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    @blur="stopEditing"
                    @keyup.enter="stopEditing"
                    ref="editInput"
                  />
                </div>
                <div v-else>
                  <span v-if="column.key === 'status'" class="inline-flex items-center">
                    <span 
                      class="w-3 h-3 rounded-full mr-2" 
                      :class="getStatusDotClass(item.status)"
                    ></span>
                    {{ getStatusLabel(item.status) }}
                  </span>
                  <span v-else class="text-gray-800">{{ item[column.key] }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="editItem(item)" 
                    class="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    @click="deleteItem(item.id)" 
                    class="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-sm text-gray-700 font-medium">
        Showing <span class="font-bold text-blue-600">{{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length) }}</span> to 
        <span class="font-bold text-blue-600">{{ Math.min(currentPage * itemsPerPage, filteredData.length) }}</span> of 
        <span class="font-bold text-blue-600">{{ filteredData.length }}</span> results
      </div>
      <div class="flex space-x-2">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          Previous
        </button>
        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95" :class="{ 'scale-100': showModal }">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingItem ? 'Edit Record' : 'Add New Record' }}
          </h3>
        </div>
        <div class="p-6">
          <div v-for="column in columns" :key="column.key" class="mb-5">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ column.label }}
            </label>
            <input
              v-if="column.key !== 'status'"
              v-model="modalForm[column.key]"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <select
              v-else
              v-model="modalForm.status"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="new">New</option>
              <option value="modified">Modified</option>
              <option value="verified">Verified</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
          <button
            @click="closeModal"
            class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveItem"
            class="px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import Sortable from 'sortablejs';
import * as XLSX from 'xlsx';
import { parse } from 'csv-parse/browser';
import createCsvWriter from 'csv-writer';

// Define types
interface DrawingDataItem {
  id: string;
  elementId: string;
  description: string;
  value: string;
  unit: string;
  status: 'new' | 'modified' | 'verified' | 'deleted';
  createdAt: string;
  updatedAt: string;
  isNew?: boolean; // For animation purposes
}

interface Column {
  key: string;
  label: string;
}

interface StatusFilter {
  key: string;
  label: string;
  activeClass: string;
  inactiveClass: string;
  dotClass: string;
}

// Reactive data
const initialData = ref<DrawingDataItem[]>([
  { id: '1', elementId: 'E001', description: 'Main beam', value: '4.5', unit: 'm', status: 'new', createdAt: '2025-01-15', updatedAt: '2025-01-15', isNew: true },
  { id: '2', elementId: 'E002', description: 'Support column', value: '3.2', unit: 'm', status: 'verified', createdAt: '2025-01-14', updatedAt: '2025-01-15' },
  { id: '3', elementId: 'E003', description: 'Foundation pad', value: '2.0', unit: 'm²', status: 'modified', createdAt: '2025-01-13', updatedAt: '2025-01-14' },
  { id: '4', elementId: 'E004', description: 'Reinforcement bar', value: '16', unit: 'mm', status: 'new', createdAt: '2025-01-12', updatedAt: '2025-01-12', isNew: true },
  { id: '5', elementId: 'E005', description: 'Concrete grade', value: 'C25/30', unit: '-', status: 'verified', createdAt: '2025-01-11', updatedAt: '2025-01-11' },
  { id: '6', elementId: 'E006', description: 'Steel grade', value: 'S355', unit: '-', status: 'deleted', createdAt: '2025-01-10', updatedAt: '2025-01-10' },
]);

const data = ref<DrawingDataItem[]>([...initialData.value]);
const searchQuery = ref('');
const activeStatusFilters = ref<string[]>(['new', 'modified', 'verified', 'deleted']);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showModal = ref(false);
const editingItem = ref<DrawingDataItem | null>(null);
const modalForm = ref<Partial<DrawingDataItem>>({});
const editingCell = ref<{ id: string; field: string } | null>(null);
const dragColumnIndex = ref<number | null>(null);
const isDragging = ref(false);
const showExportMenu = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// Columns configuration
const columns = ref<Column[]>([
  { key: 'elementId', label: 'Element ID' },
  { key: 'description', label: 'Description' },
  { key: 'value', label: 'Value' },
  { key: 'unit', label: 'Unit' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created' },
  { key: 'updatedAt', label: 'Updated' },
]);

const visibleColumns = computed(() => {
  return columns.value.filter(col => !hiddenColumns.value.includes(col.key));
});

const hiddenColumns = ref<string[]>([]);

// Status filters configuration
const statusFilters: StatusFilter[] = [
  {
    key: 'new',
    label: 'New',
    activeClass: 'bg-blue-100 text-blue-800',
    inactiveClass: 'bg-gray-100 text-gray-800',
    dotClass: 'bg-blue-500'
  },
  {
    key: 'modified',
    label: 'Modified',
    activeClass: 'bg-yellow-100 text-yellow-800',
    inactiveClass: 'bg-gray-100 text-gray-800',
    dotClass: 'bg-yellow-500'
  },
  {
    key: 'verified',
    label: 'Verified',
    activeClass: 'bg-green-100 text-green-800',
    inactiveClass: 'bg-gray-100 text-gray-800',
    dotClass: 'bg-green-500'
  },
  {
    key: 'deleted',
    label: 'Deleted',
    activeClass: 'bg-red-100 text-red-800',
    inactiveClass: 'bg-gray-100 text-gray-800',
    dotClass: 'bg-red-500'
  }
];

// Computed properties
const filteredData = computed(() => {
  let result = data.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(query)
      )
    );
  }

  // Apply status filter
  if (activeStatusFilters.value.length > 0) {
    result = result.filter(item => activeStatusFilters.value.includes(item.status));
  }

  // Apply pagination
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return result.slice(start, end);
});

const totalPages = computed(() => {
  const totalItems = data.value.filter(item => {
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      if (!Object.values(item).some(val => 
        String(val).toLowerCase().includes(query)
      )) {
        return false;
      }
    }
    
    // Apply status filter
    if (activeStatusFilters.value.length > 0 && !activeStatusFilters.value.includes(item.status)) {
      return false;
    }
    
    return true;
  }).length;
  
  return Math.ceil(totalItems / itemsPerPage.value);
});

// Methods
const toggleStatusFilter = (status: string) => {
  const index = activeStatusFilters.value.indexOf(status);
  if (index > -1) {
    activeStatusFilters.value.splice(index, 1);
  } else {
    activeStatusFilters.value.push(status);
  }
  currentPage.value = 1; // Reset to first page when filter changes
};

const getStatusCount = (status: string) => {
  return data.value.filter(item => item.status === status).length;
};

const getStatusDotClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    'new': 'bg-blue-500',
    'modified': 'bg-yellow-500',
    'verified': 'bg-green-500',
    'deleted': 'bg-red-500'
  };
  return statusClasses[status] || 'bg-gray-500';
};

const getStatusLabel = (status: string) => {
  const statusLabels: Record<string, string> = {
    'new': 'New',
    'modified': 'Modified',
    'verified': 'Verified',
    'deleted': 'Deleted'
  };
  return statusLabels[status] || status;
};

const openAddModal = () => {
  editingItem.value = null;
  modalForm.value = {
    elementId: '',
    description: '',
    value: '',
    unit: '',
    status: 'new',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  showModal.value = true;
};

const editItem = (item: DrawingDataItem) => {
  editingItem.value = { ...item };
  modalForm.value = { ...item };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingItem.value = null;
};

const saveItem = () => {
  if (editingItem.value) {
    // Update existing item
    const index = data.value.findIndex(item => item.id === editingItem.value?.id);
    if (index !== -1) {
      // Mark as modified if status was changed from new
      if (editingItem.value.status === 'new' && modalForm.value.status !== 'new') {
        modalForm.value.status = 'modified';
      }
      data.value[index] = { ...modalForm.value as DrawingDataItem };
      data.value[index].updatedAt = new Date().toISOString().split('T')[0];
    }
  } else {
    // Add new item
    const newItem: DrawingDataItem = {
      id: `${Date.now()}`,
      ...modalForm.value as Omit<DrawingDataItem, 'id'>,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isNew: true
    };
    data.value.push(newItem);
    
    // Remove the isNew flag after a short delay to stop the animation
    setTimeout(() => {
      const itemIndex = data.value.findIndex(item => item.id === newItem.id);
      if (itemIndex !== -1) {
        data.value[itemIndex].isNew = false;
      }
    }, 2000);
  }
  
  closeModal();
};

const deleteItem = (id: string) => {
  if (confirm('Are you sure you want to delete this record?')) {
    const index = data.value.findIndex(item => item.id === id);
    if (index !== -1) {
      // Mark as deleted instead of removing
      data.value[index].status = 'deleted';
      data.value[index].updatedAt = new Date().toISOString().split('T')[0];
    }
  }
};

const toggleColumnVisibility = (key: string) => {
  const index = hiddenColumns.value.indexOf(key);
  if (index > -1) {
    hiddenColumns.value.splice(index, 1);
  } else {
    hiddenColumns.value.push(key);
  }
};

const startEditing = (item: DrawingDataItem, field: string) => {
  editingCell.value = { id: item.id, field };
};

const stopEditing = () => {
  editingCell.value = null;
};

const isEditing = (id: string, field: string) => {
  return editingCell.value?.id === id && editingCell.value?.field === field;
};

const exportData = async (format: 'csv' | 'xlsx') => {
  // Prepare data for export
  const headers = visibleColumns.value.map(col => col.key);
  const headerLabels = visibleColumns.value.map(col => col.label);
  
  const rows = data.value.map(item => {
    const row: any = {};
    visibleColumns.value.forEach(col => {
      row[col.key] = item[col.key as keyof DrawingDataItem];
    });
    return row;
  });

  if (format === 'csv') {
    // Using csv-writer for proper CSV formatting
    const csvWriter = createCsvWriter({
      path: 'temp.csv', // This won't be used since we're using writeBuffer
      header: visibleColumns.value.map(col => ({ id: col.key, title: col.label }))
    });

    const csvBuffer = await csvWriter.writeRecords(rows);
    
    // Create and download the file
    const blob = new Blob([csvBuffer], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `drawing_data_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else if (format === 'xlsx') {
    // Create worksheet
    const wsData = [headerLabels, ...rows.map(row => visibleColumns.value.map(col => row[col.key]))];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Drawing Data');
    
    // Export to file
    XLSX.writeFile(wb, `drawing_data_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }
  
  // Close the export menu after selection
  showExportMenu.value = false;
};

const handleFileImport = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  const fileName = file.name.toLowerCase();
  
  try {
    if (fileName.endsWith('.csv')) {
      // Handle CSV import
      const text = await file.text();
      
      // Parse CSV content using a promise-based approach
      const parsedData = await new Promise<any[]>((resolve, reject) => {
        parse(text, { 
          columns: true,
          skip_empty_lines: true
        }, (err, output) => {
          if (err) {
            console.error('Error parsing CSV:', err);
            reject(err);
            return;
          }
          resolve(output);
        });
      });
      
      const importedData: DrawingDataItem[] = [];
      
      parsedData.forEach((row: any) => {
        const newItem: DrawingDataItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
          elementId: row['Element ID'] || row['elementId'] || '',
          description: row.Description || row.description || '',
          value: row.Value || row.value || '',
          unit: row.Unit || row.unit || '',
          status: (row.Status || row.status || 'new').toLowerCase() as 'new' | 'modified' | 'verified' | 'deleted',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          isNew: true
        };
        
        // Validate required fields
        if (newItem.elementId && newItem.description) {
          importedData.push(newItem);
        }
      });
      
      // Add the new items to the data array
      if (importedData.length > 0) {
        data.value.push(...importedData);
        alert(`Successfully imported ${importedData.length} records from CSV file.`);
      } else {
        alert('No valid records found in the CSV file.');
      }
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      // Handle Excel import
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      // Get the first worksheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const importedData: DrawingDataItem[] = [];
      
      jsonData.forEach((row: any) => {
        const newItem: DrawingDataItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
          elementId: row['Element ID'] || row['elementId'] || row['ElementID'] || '',
          description: row.Description || row.description || '',
          value: row.Value || row.value || '',
          unit: row.Unit || row.unit || '',
          status: (row.Status || row.status || 'new').toLowerCase() as 'new' | 'modified' | 'verified' | 'deleted',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          isNew: true
        };
        
        // Validate required fields
        if (newItem.elementId && newItem.description) {
          importedData.push(newItem);
        }
      });
      
      // Add the new items to the data array
      if (importedData.length > 0) {
        data.value.push(...importedData);
        alert(`Successfully imported ${importedData.length} records from Excel file.`);
      } else {
        alert('No valid records found in the Excel file.');
      }
    } else {
      alert('Unsupported file format. Please select a CSV or Excel file.');
    }
  } catch (error) {
    console.error('Error importing file:', error);
    alert('Error importing file. Please check the file format and try again.');
  } finally {
    // Reset the file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

// Drag and drop functionality for rows
let draggedItemIndex: number | null = null;

const startRowDrag = (e: DragEvent, index: number) => {
  draggedItemIndex = index;
  e.dataTransfer?.setData('text/plain', index.toString());
  isDragging.value = true;
};

const dragOver = (e: DragEvent, index: number) => {
  e.preventDefault();
  // Visual feedback can be added here
};

const drop = (e: DragEvent, targetIndex: number) => {
  e.preventDefault();
  if (draggedItemIndex !== null && draggedItemIndex !== targetIndex) {
    // Reorder the array
    const draggedItem = data.value[draggedItemIndex];
    data.value.splice(draggedItemIndex, 1);
    data.value.splice(targetIndex, 0, draggedItem);
    draggedItemIndex = null;
  }
  isDragging.value = false;
};

const endRowDrag = () => {
  draggedItemIndex = null;
  isDragging.value = false;
};

// Column drag functionality
const startColumnDrag = (e: MouseEvent) => {
  // Implementation for column dragging would go here
  // This is a simplified version - full implementation would require more complex logic
};

const handleColumnDrag = (e: MouseEvent) => {
  // Handle column drag movement
};

const endColumnDrag = () => {
  // Finalize column drag
};
</script>