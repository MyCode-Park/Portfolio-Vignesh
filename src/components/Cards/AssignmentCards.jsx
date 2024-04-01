import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Button = styled.a`
  width: 20%;
  text-align: center;
  height: fit-content;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.card_light};
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.primary};
  ${({ dull, theme }) =>
    dull &&
    `
        background-color: ${theme.bgLight};
        color: ${theme.text_secondary};
        &:hover {
            background-color: ${({ theme }) => theme.bg + 99};
        }
    `}
  cursor: pointer;
  text-decoration: none;
  transition: all 0.5s ease;
  &:hover {
    background-color: ${({ theme }) => theme.primary + 99};
  }
  @media only screen and (max-width: 600px) {
    font-size: 12px;
  }
`;

const Card = styled.div`
  width: 800px;
  height: auto;
  background-color: ${({ theme }) => theme.card};
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  padding: 26px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 50px;
`;

const Details = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding: 0px 2px;
`;

const Description = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 99};
  overflow: hidden;
  margin-top: 8px;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledAutocomplete = styled.div`
  font-size: 0px !important;
  display: flex;
  margin-top: 20px;
  justify-content: flex-start;
  align-items: center;

  .css-7r8ty1-MuiAutocomplete-root {
    margin-right: 20px;
  }
  .css-1wuilmg-MuiAutocomplete-root {
    width: 200px;
  }
  .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root {
    width: 300px;
  }
  .css-wb57ya-MuiFormControl-root-MuiTextField-root {
  }
  path {
  }
  .css-1wuilmg-MuiAutocomplete-root
    .MuiOutlinedInput-root
    .MuiAutocomplete-input {
  }
  .MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon.css-7r8ty1-MuiAutocomplete-root
    .MuiOutlinedInput-root {
  }
  .css-1jy569b-MuiFormLabel-root-MuiInputLabel-root {
  }
`;

const StyledDropdown = styled.div`
  .css-1nrlq1o-MuiFormControl-root {
    width: 200px;
  }
`;

const AssignmentCards = ({ assignment }) => {
  const [transactionData, setTransactionData] = useState(null);
  const [numItems, setNumItems] = useState(1);
  const [countryActions, setCountryActions] = useState({}); // Store country actions
  const [autocompletes, setAutocompletes] = useState([
    { index: 0, showRemoveButton: false },
  ]);

  const [data, setData] = useState(null);
  const [items, setItems] = useState([{ index: 0, showRemoveButton: false }]);
  const [numAutocompletes, setNumAutocompletes] = useState(1);
  const [selectedCountries, setSelectedCountries] = useState(
    Array.from({ length: items.length }, () => "")
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "http://43.204.243.79:8000/api/v1/payment/transactions/1"
        );
        const modifiedResponse = { ...data, value: "type-1" };
        setTransactionData(modifiedResponse);
        setData(modifiedResponse);

        // Extract and store country actions
        const actions = {};
        data.payment.withdrawl.forEach((withdrawl) => {
          withdrawl.country_sorting.forEach((countryData) => {
            actions[countryData.country] = countryData.action;
          });
        });
        setCountryActions(actions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // console.log("Autocomplete items:", autocompletes);
    // Fetch action value for selected country
    const selectedCountry = autocompletes.find(
      (item) => item.index === numAutocompletes - 1
    )?.country;
    // console.log("Selected country:", selectedCountry);
    if (selectedCountry) {
      const action = countryActions[selectedCountry];
      console.log("Action value:", action);
      setAutocompletes((prevAutocompletes) => {
        const updatedAutocompletes = [...prevAutocompletes];
        updatedAutocompletes[numAutocompletes - 1].action = action;
        return updatedAutocompletes;
      });
    }
  }, [numAutocompletes, autocompletes, countryActions]);

  if (!transactionData) {
    return <div>Loading...</div>;
  }

  const countries = assignment.payment.withdrawl
    .map((withdrawl) =>
      withdrawl.country_sorting.map((countryData) => countryData.country)
    )
    .flat();

  const sortingOptions = assignment.payment.withdrawl
    .map((withdrawl) =>
      withdrawl.country_sorting.map((countryData) => countryData.sort)
    )
    .flat();

  const handleAddItem = () => {
    setAutocompletes((prevAutocompletes) => [
      ...prevAutocompletes,
      { index: numAutocompletes, showRemoveButton: true },
    ]);
    setNumAutocompletes(numAutocompletes + 1);
  };

  const handleAddItem1 = () => {
    setItems((prevItems) => [
      ...prevItems,
      { index: numItems, showRemoveButton: true },
    ]);
    setNumItems(numItems + 1);
  };

  const handleRemoveItem = (indexToRemove) => {
    if (numAutocompletes > 1) {
      setAutocompletes((prevAutocompletes) =>
        prevAutocompletes.filter((item) => item.index !== indexToRemove)
      );
      setNumAutocompletes((prevNum) => prevNum - 1);
    }
  };

  const handleRemoveItem1 = (indexToRemove) => {
    if (numItems > 1) {
      setItems((prevItems) =>
        prevItems.filter((item) => item.index !== indexToRemove)
      );
      setNumItems((prevNum) => prevNum - 1);
    }
  };

  const handleCountryChange = (index, country) => {
    // Handle country change event
    const action = countryActions[country];
    setAutocompletes((prevAutocompletes) =>
      prevAutocompletes.map((item) =>
        item.index === index ? { ...item, action } : item
      )
    );
  };

  const handleCountryChange1 = (index, country) => {
    // Handle country change event
    let action = false;
    if (countryActions.hasOwnProperty(country)) {
      action = countryActions[country];
    }
    console.log("Action", action);
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.index === index) {
          return { ...item, action };
        }
        return item;
      })
    );
  };
  console.log("item", items);

  return (
    <div id="assignment">
      <Card onClick={() => ({ state: true, assignment: assignment })}>
        <Title>Senario 1</Title>
        <Description>
          The API has populated the data in the autocomplete, when the country
          is selected the toggls is updated acordingly
        </Description>
        <div id="card-1">
          {autocompletes.map(({ index, country, action, showRemoveButton }) => (
            <StyledAutocomplete
              key={index}
              style={{ display: "flex", marginBottom: "20px" }}
            >
              <div style={{ marginRight: "20px" }}>
                <Autocomplete
                  disablePortal
                  id={`combo-box-country-${index}`}
                  options={countries}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Country" />
                  )}
                  onChange={(event, value) => handleCountryChange(index, value)}
                />
              </div>
              <Autocomplete
                disablePortal
                id={`combo-box-sort-${index}`}
                options={sortingOptions}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Sort" />}
              />
              <div
                style={{
                  marginLeft: "20px",
                  marginRight: "20px",
                  alignContent: "center",
                }}
              >
                <FormGroup row>
                  <FormControlLabel
                    control={<Switch checked={action} disabled={!action} />}
                    label="Action"
                  />
                </FormGroup>
              </div>
              {showRemoveButton && (
                <Button onClick={() => handleRemoveItem(index)}>Remove</Button>
              )}
            </StyledAutocomplete>
          ))}
          <Button onClick={handleAddItem}>+ Add Item</Button>
        </div>
      </Card>

      <Card onClick={() => ({ state: true, assignment: assignment })}>
        <Title>Senario 2</Title>
        <Description>
          The API has populated the data in the autocomplete, and has loaded the
          1st item into the dropdown and when another item is added the next
          item data will be automaticaly get updatde in the dropdown.
        </Description>
        <div id="card-2">
          {items.map(
            ({ index, showRemoveButton, country, action }, itemIndex) => (
              <StyledDropdown>
                <div
                  key={index}
                  style={{
                    display: "flex",
                    marginBottom: "20px",
                    marginTop: "20px",
                  }}
                >
                  <FormControl style={{ marginRight: "20px", minWidth: 120 }}>
                    <InputLabel id={`label-country-${index}`}>
                      Country
                    </InputLabel>
                    <Select
                      labelId={`label-country-${index}`}
                      id={`combo-box-country-${index}`}
                      value={countries[itemIndex]} // eslint-disable-line
                      onChange={(e) =>
                        handleCountryChange1(index, e.target.value)
                      }
                      label="Country"
                    >
                      {countries.map((country, idx) => (
                        <MenuItem key={idx} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl style={{ marginRight: "20px", minWidth: 120 }}>
                    <InputLabel id={`label-sort-${index}`}>Sort</InputLabel>
                    <Select
                      labelId={`label-sort-${index}`}
                      id={`combo-box-sort-${index}`}
                      value={sortingOptions[itemIndex]} // Use state variable for selected sorting option
                      label="Sort"
                    >
                      {sortingOptions.map((option, idx) => (
                        <MenuItem key={idx} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div style={{ marginRight: "20px", alignContent: "center" }}>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={action} // Use state variable for toggle status
                            disabled={!action} // Disable if action is false
                          />
                        }
                        label="Action"
                      />
                    </FormGroup>
                  </div>

                  {showRemoveButton && (
                    <Button onClick={() => handleRemoveItem1(index)}>
                      Remove
                    </Button>
                  )}
                </div>
              </StyledDropdown>
            )
          )}
          <Button onClick={handleAddItem1}>+ Add Item</Button>
        </div>
      </Card>
    </div>
  );
};

export default AssignmentCards;
