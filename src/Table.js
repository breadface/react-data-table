import React from "react";
import { orderBy, capitalize } from "lodash";

const Column = ({ children, ...props }) => <td {...props}>{children}</td>;
const ColumnHeader = ({ children, ...props }) => <th {...props}>{children}</th>;
const Row = ({ children }) => <tr>{children}</tr>;

const CheckBox = ({ checked = false, onChange }) => (
  <td>
    <input type="checkbox" checked={checked} onChange={onChange} />
  </td>
);

let order = {
  up: "asc",
  down: "desc"
};

let chevron = {
  up: "▴",
  down: "▾"
};

const List = {
  Sort: ({ children, sort }) =>
    orderBy(
      React.Children.toArray(children),
      [({ props, sort }) => props.name],
      [order[sort]]
    ),
  Filter: ({ children }) =>
    React.Children.toArray(children).filter(
      ({ props }) => typeof props.children !== "boolean"
    )
};

let mapData = data => {
  return (data || []).map(item => {
    if (typeof item === "object") {
      return { ...item, checked: false };
    } else {
      return { name: item, checked: false };
    }
  });
};

let mapItem = (item, key) => {
  if (typeof item[key] === "function") {
    return item[key](item);
  } else {
    return item[key];
  }
};

let mapHeaders = (headers, data) => {
  if (headers) {
    return headers;
  } else if (data && typeof data === "object") {
    return Object.keys(data).map(key => ({ label: capitalize(key), key: key }));
  } else {
    return [];
  }
};

const Table = ({
  data,
  check,
  onChange,
  onSort,
  allChecked,
  onChangeAll,
  headers,
  sortKey,
  sortDirection
}) => {
  return (
    <table>
      <thead>
        <Row>
          {check && <CheckBox onChange={onChangeAll} checked={allChecked} />}
          {headers.map(item => (
            <ColumnHeader onClick={onSort(item.key)}>
              {item.label}
              <span className="">{chevron[sortDirection]}</span>
            </ColumnHeader>
          ))}
        </Row>
      </thead>
      <tbody>
        <List.Sort sort={sortDirection}>
          {data.map((item, index) => (
            <Row name={item[sortKey]}>
              {check && (
                <CheckBox onChange={onChange(index)} checked={item.checked} />
              )}
              {Object.entries(item).map(([key, value]) => (
                <Column>{mapItem(item, key)}</Column>
              ))}
            </Row>
          ))}
        </List.Sort>
      </tbody>
    </table>
  );
};

const Filter = ({ onChange }) => {
  return <input type="text" onChange={onChange} />;
};

/*
  page - Items per page
  items - Total number of rows

*/

const Next = ({ page, pages, onNext }) => {
  if (page < pages) {
    return (
      <button className="interactive" onClick={onNext}>
        {/*<Icon icon="arrow-right" />*/}Next
      </button>
    );
  } else {
    return null;
  }
};

const Prev = ({ page, onPrev }) => {
  if (page > 1) {
    return (
      <button className="" onClick={onPrev}>
        {/*<Icon icon="arrow-left" />*/}Prev
      </button>
    );
  } else {
    return null;
  }
};

const Paginate = ({
  numberOfFetchedItems,
  count,
  total,
  page,
  setCurrentPage,
  more
}) => {
  if (!numberOfFetchedItems) return null;

  let pages = Math.floor(total / count) + (total % count > 0 ? 1 : 0);
  let currentPage =
    page - Math.floor(numberOfFetchedItems / count) >= 2
      ? Math.floor(numberOfFetchedItems / count)
      : page;

  let onNext = () => {
    setCurrentPage(page + 1, () => {
      if (
        numberOfFetchedItems < (page + 1) * count &&
        numberOfFetchedItems < total
      )
        more();
    });
  };

  let onPrev = () => {
    setCurrentPage(page - 1);
  };

  return (
    <div>
      <span>
        <span>{total}</span>&nbsp;Results
      </span>
      <div>
        <Prev page={page} onPrev={onPrev} />
        {page}
        <Next page={currentPage} pages={pages} onNext={onNext} />
      </div>
    </div>
  );
};

class DataTable extends React.PureComponent {
  state = {
    headers: mapHeaders(this.props.headers, this.props.data ? this.props.data[0] : null),
    data: mapData(this.props.data),
    sortDirection: "up",
    sortKey: "name",
    check: this.props.check || false,
    allChecked: false,
    filterValue: ""
  };

  handleCheckbox = index => e => {
    this.setState({
      allChecked: false,
      data: this.state.data.map((item, id) => {
        if (id === index) {
          return { ...item, checked: !item.checked };
        } else {
          return item;
        }
      })
    });
  };

  handleAllCheckbox = e => {
    let { allChecked } = this.state;
    this.setState({
      allChecked: !allChecked,
      data: this.state.data.map(item => ({ ...item, checked: !allChecked }))
    });
  };

  handleSearch = value => {
    if (this.props.onSearch) {
      return undefined;
    } else {
      return this.props.data.filter(item => {
        return Object.values(item).some(x => x.search(value) !== -1);
      });
    }
  };

  handleChange = e => {
    //Make this an api search or just search through the list
    let { value } = e.target;
    this.setState(
      {
        filterValue: value,
        data: this.handleSearch(value)
      },
      () => {
        if (this.props.onSearch) {
          this.props.onSearch(value);
        }
      }
    );
  };

  handleSort = key => e => {
    this.setState({ sortKey: key });
  };

  render() {
    const { filter = true } = this.props;
    const {
      check,
      data,
      headers,
      sortKey,
      sortDirection,
      allChecked
    } = this.state;

    let { pageMeta } = this.props;
    return (
      <React.Fragment>
        {filter && <Filter data={data} onChange={this.handleChange} />}
        <Table
          check={check}
          allChecked={allChecked}
          headers={headers}
          data={data}
          onSort={this.handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onChangeAll={this.handleAllCheckbox}
          onChange={this.handleCheckbox}
        />
        <Paginate {...pageMeta} />
      </React.Fragment>
    );
  }
}

export default DataTable;
