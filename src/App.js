import {useState, useEffect} from 'react'; 
import axios from 'axios';
import styled from 'styled-components';

const StyledForm = styled.form`
  margin: auto;
  padding: 15px;
  max-width: 400px;
  align-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: ${props => props.isMargin ? '15px': 0};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #f1f1f1;
  color: #333;
  margin-right: 8px;
`;

const Button = styled.button`
  display: inline-block;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  background-color: ${({ background }) => background ? background : '#4CAF50'};
  color: ${({ color }) => color ? color : '#fff'};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 8px;
  
  &:hover {
    background-color: #3e8e41;
  }
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #39a359;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 8px;
  background-color: #a34039;
`;

const TableCell = styled.td`
  text-align: left;
  padding: 8px;
`;

const HeaderText = styled.h1`
  text-align: center;
`;

const StyledSelect = styled.select`
  font-size: 16px;
  font-weight: bold;
  padding: 8px 16px;
  border: none;
  background-color: #4CAF50;
  color: #fff;
  cursor: pointer;
  margin: 18px;
`;

const StyledOption = styled.option`
  font-size: 16px;
  font-weight: bold;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: #fff;
`;

function App() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageData, setCurrentPageData] = useState([]);

  const rowsPerPage = 4;
  
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const sortOptions = ['name', 'email', 'phone', 'address', 'status'];

  const loadUsersData = async () => {
    return await axios
    .get(`http://localhost:5000/users`)
    .then(response => {
      setData(response.data);
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    loadUsersData();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setCurrentPageData(data.slice(startIndex, endIndex));
  }, [currentPage, data]);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const tableRows = currentPageData.map(({id, name, email, phone, address, status}) => (
        <TableRow key={id}>
          {Object.values({ name, email, phone, address, status }).map(value => (
            <TableCell>
              {value}
            </TableCell>
          ))}
        </TableRow>
  ));

  const handleReset = () => {
    loadUsersData();
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    return axios
    .get(`http://localhost:5000/users?q=${searchText}`)
    .then(response => {
      setData(response.data);
      setSearchText('');
    })
    .catch(err => console.log(err));
  };

  const handleSort = async (e) => {
    e.preventDefault();
    let value = (e.target.value);
    setSortValue(value);
    return axios
    .get(`http://localhost:5000/users?_sort=${value}&_order=asc`)
    .then(response => {
      setData(response.data);
    })
    .catch(err => console.log(err));
  };

  const handlefiler = async (filterOption) => {
    return axios
    .get(`http://localhost:5000/users?status=${filterOption}`)
    .then(response => {
      setData(response.data);
    })
    .catch(err => console.log(err));
  };

  return (
    <>
    <StyledForm  onSubmit={handleSearch}>
      <Wrapper>
        <StyledInput 
          type="text"
          placeholder="Search user's name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="submit">Search</Button>
        <Button onClick={handleReset}>Reset</Button>
      </Wrapper>
    </StyledForm>
    <HeaderText>
      Search, Filter, Sort and pagination using JSON Fake React API
    </HeaderText>
      <Table>
        <thead>
          <TableRow>
            {['Name', 'Email', 'Phone', 'Address', 'Status'].map((value, index) => (
              <TableHeader key={index}>{value}</TableHeader>
            ))}
          </TableRow>
        </thead>
        <tbody>
            {
              tableRows.length > 0 ? tableRows : 'data not found'
            }
        </tbody>
      </Table>
      <Wrapper isMargin>
        {
          Array.from(Array(totalPages).keys()).map((pageNumber) => (
            <Button key={pageNumber} onClick={() => handlePageClick(pageNumber + 1)}>{pageNumber+1}</Button>
          ))
        }
      </Wrapper>
      <StyledSelect value={sortValue} onChange={handleSort}>
        <StyledOption>Please select a value</StyledOption>
        {sortOptions.map((value, index) => (
          <StyledOption value={value} key={index}>{value}</StyledOption>
        ))}
      </StyledSelect>
      <Wrapper>
        <h3>Filter:</h3>
        <Button onClick={() => handlefiler("Active")}>Active</Button>
        <Button onClick={() => handlefiler("Inactive")} color='#a60808' background='#baa2aa'>Inactive</Button>
      </Wrapper>
    </>
  );
}

export default App;
