# Drawing Data Manager

A beautiful Vue 3 application for managing and correcting data extracted from technical drawings with enhanced features.

## Features

- **Beautiful UI**: Enhanced styling with Tailwind CSS
- **Data Management**: Add, edit, delete, and manage drawing data
- **Batch Import/Export**: Import and export data in both CSV and Excel formats
- **Search & Filter**: Search through records and filter by status
- **Column Visibility**: Toggle visibility of columns
- **Drag & Drop**: Reorder rows with drag and drop functionality
- **Pagination**: Navigate through large datasets easily

## New Features Added

### Import/Export Functionality
- **CSV Export**: Export data to CSV format with proper formatting
- **Excel Export**: Export data to Excel format with proper formatting
- **CSV Import**: Import data from CSV files with automatic mapping
- **Excel Import**: Import data from Excel files with automatic mapping

### UI/UX Improvements
- Enhanced styling with gradient backgrounds and improved shadows
- Better modal animations and transitions
- Improved table styling with better hover effects
- Enhanced status filter buttons with better visual feedback
- Better pagination styling with highlighted numbers

## Installation

```bash
npm install
```

## Usage

```bash
npm run dev
```

## Import Format

When importing CSV or Excel files, ensure your data includes these columns:
- Element ID
- Description  
- Value
- Unit
- Status (new, modified, verified, deleted)

## Technologies Used

- Vue 3
- TypeScript
- Tailwind CSS
- xlsx (for Excel support)
- csv-parser (for CSV support)
- csv-writer (for CSV export)