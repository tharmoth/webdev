import { useState, useEffect  } from 'react'
import axios from "axios";
import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { amber, deepOrange, grey } from '@mui/material/colors';
import EnhancedTable from './EnhancedTable.js'


function App() {
	function getData() {
		axios({
		method: "GET",
		url:"/profile",
		})
		.then((response) => {
		const res =response.data
		setFoundNames(Object.keys(res))
		setProfileData(res)
		doFilter(inputName, filterMode, res)
		}).catch((error) => {
		if (error.response) {
			console.log(error.response)
			console.log(error.response.status)
			console.log(error.response.headers)
			}
		}
	)}
	
	function process(inputName, inputValue) {
		axios({
		  method: "post",
		  url:"/process",
		  data: {
			  name: inputName,
			  value: inputValue
		  }
		}).then((response) => {
			getData()
		})
	}
	
	const [profileData, setProfileData] = useState(null)
	const [inputName, setInputName] = useState('');
	const [foundNames, setFoundNames] = useState(null);
	const [filterMode, setFilterMode] = useState(null);
	const [rows, setRows] = useState(null);
	
	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
			primary: {
				main: deepOrange[900] /*or whatever color you desire */
			}
		},
	});
  
	const columns = [
		{ field: 'name', headerName: 'Name', width: 150 },
		{
			field: "processed",
			headerName: "Actions",
			width: 300,
			renderCell: (params) => (
				getButtons(params.row.name)
			),
			selectable: false,
		},
	];
	
	const filterGroup = (event, newMode) => {
		setFilterMode(newMode);
		doFilter(inputName, newMode, profileData);
	};
    //end of new line
	
	const filter = (e) => {
		doFilter(e.target.value, filterMode, profileData)
	};
	
	function doFilter(keyword, mode, data) {
		
		var results = []
		if (keyword !== '') {
			results = Object.keys(data).filter((name) => {
				if (mode === "processed" && data[name] === "FALSE") {
					return false;
				} else if (mode === "unprocessed" && data[name] === "TRUE") {
					return false;
				} else {
					return name.toLowerCase().startsWith(keyword.toLowerCase());
				}
			});

		} else {
			results = Object.keys(data).filter((name) => {
				if (mode === "processed" && data[name] === "FALSE") {
					return false;
				} else if (mode === "unprocessed" && data[name] === "TRUE") {
					return false;
				} else {
					return true;
				}
			});
		}
		
		setRows(results.map(name => ({id : results.indexOf(name), name, processed : data[name]})));
		setFoundNames(results);
		setInputName(keyword);
	}
	
	function onDownload(name) {
		var a = document.createElement("a");
		a.href = "data.csv";
		a.setAttribute("download", name + ".csv");
		a.click();
	}
	
	function openXml() {
		let blob = new Blob(["note.xml"], {type: 'text/xml'});
		let url = URL.createObjectURL(blob);
		window.open(url);
		URL.revokeObjectURL(url); 
	}
	
	function getButtons(inputName) {
		if (profileData[inputName] == "TRUE") {
			return (
			<div className="list-button">
			<ButtonGroup variant="contained" aria-label="outlined primary button group">
				<Button variant="contained" onClick={() => openXml(inputName)}>Open</Button>
				<Button variant="contained" onClick={() => onDownload(inputName)}>Download</Button>
				<Button variant="contained" onClick={() => process(inputName, false)}>Delete</Button>
				</ButtonGroup>
			</div>
				);
		} else {
			return <span className="list-button"> <Button variant="contained" onClick={() => process(inputName, true)}>Process</Button> </span>
		}
	}
	
	useEffect(() => {
		 getData();
	});
	
	const [selectionModel, setSelectionModel] = useState([]);

	return (
	<ThemeProvider theme={darkTheme}>
	<CssBaseline />
	<div className="App">
		<header className="App-header">
			<img className="logo" src={"WebDevLogo.png"} alt="My logo" />
		</header>
		<main>
		{profileData && <div>
			<div className="filterField">
				<TextField 
				type="search"
				value={inputName}
				className="input"
				placeholder="Filter"
				onChange={filter}
				/>
					
				<ToggleButtonGroup
				value={filterMode}
				exclusive
				onChange={filterGroup}
				aria-label="Platform">
					<ToggleButton value="processed">Processed</ToggleButton>
					<ToggleButton value="unprocessed">Unprocessed</ToggleButton>
				</ToggleButtonGroup>
			</div>
			
			<div className="list">
				<DataGrid
				rows={rows}
				columns={columns}
				initialState={{
					sorting: {
					  sortModel: [{ field: 'processed', sort: 'desc' }],
					},
				}}
				onSelectionModelChange={(newSelectionModel) => {
					setSelectionModel(newSelectionModel);
				}}
				selectionModel={selectionModel}
				disableSelectionOnClick
				checkboxSelection
				/>
			</div>
		</div>}
		</main>
    </div>
	</ThemeProvider>
  );
}

export default App;