# Data Table

## Getting started
 - ### Installation

```
  npm install --save react-data-table or yarn react-data-table with yarn
```

### Basic Usage

```javascript
import React, { Component } from 'react';
import Table from '@intelia/data-table';

let data = [
  { name: "React", version: 2 },
  { name: "Angular", version: 1 },
  { name: "Vue", version: 3 },
];

let headers = [
  { label: "Framework", key: "name" },
  { label: "Version", key: "verison" }
];

class App extends Component {
  state = {
   data: data
  }

  componentDidMount() {
   //logic to update data
  }

  handleSearch = value => {
   /*
     You must use this logic to update table data state
   */
  }

  render() {
   const { data } = this.state;
     return (
        <Table
          data={data}
          headers={headers}
          check={false}
          onSearch={this.handleSearch}
          pageMeta={{
            count: 2,
            numberOfFetchedItems: data.length,
            total: 20,
            page: 1
          }}
        />
     );
  }
}

```

### Table Props
 - Table props - props include..

```js
  Table.propTypes = {
    data: PropTypes.array,
    headers: PropTypes.array,
    check: PropTypes.boolean, // Enable checkbox with by setting check to true
    sortDirection: PropTypes.string, //On of types "up | down" where "up" is ascending and "down" descending
    onSearch: PropTypes.function, //Logic to search table data - the logic must set table data
    pageMeta: PropTypes.object
  };
```

### Working with pagination
 Pagination is enabled using the pageMeta prop which is an object consisting of
  - count: -  Maximum number of data per page
  - page - Current page
  - numberOfFetchedItems - All items fetched from the endpoint. This value remains consistent for static data
  - total - Total number of items. The is usually the total item in the database or the current length of data for static data

### TODO
 - Default table style
 - Support for table styles and other components using classNames
 - Pagination style
 - Write more unit test

### Contribution
  Feel free to clone the repo and create a pr! :smile:
