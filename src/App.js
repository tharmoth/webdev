import { useState } from 'react'
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

function App() {

   // new line start
  const [profileData, setProfileData] = useState(null)
  const [inputName, setInputName] = useState('');
  const [foundNames, setFoundNames] = useState(null);
  const [filterMode, setFilterMode] = useState(null);
  
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
    })}
	
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
	
	const filterGroup = (event, newMode) => {
		setFilterMode(newMode);
		doFilter(inputName, newMode, profileData);
	};
    //end of new line
	
	const filter = (e) => {
		doFilter(e.target.value, filterMode, profileData)
	};
	
	function doFilter(keyword, mode, data) {
		if (keyword !== '') {
			const results = Object.keys(data).filter((name) => {
				if (mode === "processed" && data[name] === "FALSE") {
					return false;
				} else if (mode === "unprocessed" && data[name] === "TRUE") {
					return false;
				} else {
					return name.toLowerCase().startsWith(keyword.toLowerCase());
				}
			});
			
			setFoundNames(results);
		} else {
			const results = Object.keys(data).filter((name) => {
				if (mode === "processed" && data[name] === "FALSE") {
					return false;
				} else if (mode === "unprocessed" && data[name] === "TRUE") {
					return false;
				} else {
					return true;
				}
			});
			
			setFoundNames(results);
		// If the text field is empty, show all users
		}
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

  return (
    <div className="App">
      <header className="App-header">

        {/* new line start*/}
        <Button variant="contained" onClick={getData}>Click me</Button>
        {profileData && <div>
				<div className="filterField">
					<TextField 
					type="search"
					value={inputName}
					className="input"
					placeholder="Filter"
					onChange={filter}
					sx={{ input: { color: 'white' } }}
					/>
					
					<ToggleButtonGroup
					color="primary"
					value={filterMode}
					exclusive
					onChange={filterGroup}
					aria-label="Platform"
					>
						<ToggleButton value="processed">Processed</ToggleButton>
						<ToggleButton value="unprocessed">Unprocessed</ToggleButton>
					</ToggleButtonGroup>
				</div>
				
				<div className="list">
				<List sx={{ width: '100%'}}>{
					foundNames.sort((name1, name2) => {
						if (profileData[name1] == "FALSE") {
							return 1
						} else if (profileData[name2] == "FALSE") {
							return -1
						} else {
							return 1
						}
					}).map(name => {
						return (
						<ListItem disablePadding>   
							<ListItemText primary={name}/>
							{getButtons(name)}
						</ListItem>
					);
				})
			  }</List>
			  </div>
            </div>
        }
        {/* end of new line */}
      </header>
    </div>
  );
}

export default App;