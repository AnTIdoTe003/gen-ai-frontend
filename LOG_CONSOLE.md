# Log Console

A comprehensive log monitoring and analysis interface built with Next.js and TypeScript.

## Features

### 🔍 **Advanced Filtering**

- **Search Query**: Full-text search across log messages, errors, and modules
- **Log Level**: Filter by debug, info, warn, error, or fatal levels
- **Module**: Filter by specific service modules
- **Error Status**: Show only logs with errors
- **Date Range**: Filter by timestamp with date picker
- **Sorting**: Sort by timestamp, level, module, or error status
- **Order**: Ascending or descending order

### 📊 **Real-time Statistics**

- **Overview Dashboard**: Total logs, error rates, and counts
- **Log Level Distribution**: Visual breakdown with progress bars
- **Module Statistics**: Error counts and rates per module
- **Recent Errors**: Latest error entries for quick reference

### 📋 **Log Table**

- **Comprehensive Display**: Timestamp, level, module, message, and error status
- **Detailed View**: Click to see full log details including stack traces and metadata
- **Pagination**: Navigate through large log sets efficiently
- **Auto-refresh**: Updates every 30 seconds automatically

### 💾 **Export Functionality**

- **JSON Export**: Download filtered logs in JSON format
- **Custom Filename**: Automatically generates timestamped filenames

### 🎨 **Modern UI**

- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Supports theme switching
- **Loading States**: Smooth loading indicators
- **Error Handling**: Clear error messages and alerts

## API Integration

The log console is designed to work with REST APIs that match the following structure:

### Endpoints

- `GET /api/logs` - Fetch paginated logs with filtering
- `GET /api/logs/stats` - Get log statistics and analytics

### Query Parameters

The `/api/logs` endpoint supports these parameters:

- `level`: Log level (debug, info, warn, error, fatal)
- `module`: Service module name
- `hasError`: Boolean to filter error logs
- `q`: Search query string
- `from`: Start date (ISO string)
- `to`: End date (ISO string)
- `order`: Sort order (asc, desc)
- `page`: Page number for pagination
- `limit`: Number of logs per page
- `sortBy`: Sort field (timestamp, level, module, hasError)

### Example API Call

```bash
curl --location --request GET 'http://localhost:4001/api/v1/logs?level=info&module=User%20Service&hasError=true&q=Payment%20failed&from=2025-09-05T00%3A00%3A00.000Z&to=2025-09-16T23%3A59%3A59.999Z&order=desc&page=1&limit=50' \
--header 'Content-Type: application/x-www-form-urlencoded'
```

## Configuration

### Environment Variables

Set `NEXT_PUBLIC_API_URL` to point to your log API:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4001/api/v1
```

If not set, it defaults to `/api` for local development.

### Mock Data

For testing, mock API endpoints are provided at:

- `/api/logs` - Mock log data
- `/api/logs/stats` - Mock statistics

## Usage

1. Navigate to `/logs` in your application
2. Use the filter panel to narrow down log entries
3. View logs in the table with pagination
4. Click the eye icon to see detailed log information
5. Switch to the Statistics tab for analytics
6. Use the Export button to download filtered logs
7. Refresh manually or wait for auto-refresh

## Components

- `LogFilters` - Filter and search controls
- `LogTable` - Paginated log display with details
- `LogStats` - Statistics and analytics dashboard
- `LogService` - API service layer

## Dependencies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI components
- Lucide React icons
- date-fns (for date formatting)

## File Structure

```
src/
├── components/logs/
│   ├── log-filters.tsx      # Filter controls
│   ├── log-table.tsx        # Log display table
│   └── log-stats.tsx        # Statistics dashboard
├── lib/
│   └── log-service.ts       # API service
├── types/
│   └── logs.ts              # TypeScript types
├── pages/
│   ├── logs.tsx             # Main log console page
│   └── api/
│       ├── logs.ts          # Mock logs API
│       └── logs/
│           └── stats.ts     # Mock stats API
```
