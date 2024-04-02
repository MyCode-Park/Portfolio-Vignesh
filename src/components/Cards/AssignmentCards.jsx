import {
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

const Card = styled.div`
  width: 500px;
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

const StyledDropdown = styled.div`
  .css-1nrlq1o-MuiFormControl-root {
    width: 45%;
  }
  .css-1u3bzj6-MuiFormControl-root-MuiTextField-root {
    width: 94%;
  }
`;

const AssignmentCards = ({ assignment }) => {
  const [transactionData, setTransactionData] = useState(null);
  const [countryActions, setCountryActions] = useState({}); // Store country actions
  const [autocompletes, setAutocompletes] = useState([
    { index: 0, showRemoveButton: false },
  ]);

  const [data, setData] = useState(null);
  const [items, setItems] = useState([{ index: 0, showRemoveButton: false }]);
  const [numAutocompletes, setNumAutocompletes] = useState(1);

  console.log("auto", numAutocompletes);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "http://43.204.243.79:8000/api/v1/payment/transactions/1"
        );
        const modifiedResponse = { ...data, value: "type-1" };

        setTransactionData(modifiedResponse);
        setData(modifiedResponse);

        const actions = data.payment.withdrawl.reduce((acc, withdrawl) => {
          withdrawl.country_sorting.forEach(({ country, action }) => {
            acc[country] = action;
          });
          return acc;
        }, {});

        setCountryActions(actions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const selectedCountry = autocompletes.find(
      (item) => item.index === numAutocompletes - 1
    )?.country;
    if (selectedCountry) {
      const action = countryActions[selectedCountry];
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
      <StyledDropdown>
        <Card onClick={() => ({ state: true, assignment: assignment })}>
          <div id="card-2">
            {items.map(({ index }, itemIndex) => (
              <div key={index}>
                {/* Render only one TextField component */}
                {itemIndex === 0 &&
                  assignment.payment.withdrawl[itemIndex]?.custom_input.length >
                    0 && (
                    <TextField
                      id={`outlined-basic-${index}`}
                      label={
                        Object.keys(
                          assignment.payment.withdrawl[itemIndex]
                            .custom_input[0]
                        )[1]
                      }
                      variant="outlined"
                      value={
                        assignment.payment.withdrawl[itemIndex].custom_input[0]
                          .label
                      }
                      style={{ marginBottom: "20px", minWidth: 120 }}
                    />
                  )}
                {/* Map all the country items */}
                {assignment.payment.withdrawl[itemIndex]?.country_sorting.map(
                  (countryData, countryIndex) => (
                    <div
                      key={`${index}-${countryIndex}`}
                      style={{ marginBottom: "20px" }}
                    >
                      <FormControl
                        style={{ marginRight: "20px", minWidth: 120 }}
                      >
                        <InputLabel
                          id={`label-country-${index}-${countryIndex}`}
                        >
                          {
                            Object.keys(
                              assignment.payment.withdrawl[itemIndex]
                                .country_sorting[0]
                            )[2]
                          }
                        </InputLabel>
                        <Select
                          labelId={`label-country-${index}-${countryIndex}`}
                          id={`combo-box-country-${index}-${countryIndex}`}
                          value={countryData.country}
                          onChange={(e) =>
                            handleCountryChange1(index, e.target.value)
                          }
                          label="Country"
                        >
                          {/* Render dropdown options for each country */}
                          {assignment.payment.withdrawl[
                            itemIndex
                          ]?.country_sorting.map((option, idx) => (
                            <MenuItem key={idx} value={option.country}>
                              {option.country}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl style={{ minWidth: 120 }}>
                        <InputLabel id={`label-sort-${index}-${countryIndex}`}>
                          {
                            Object.keys(
                              assignment.payment.withdrawl[itemIndex]
                                .country_sorting[0]
                            )[0]
                          }
                        </InputLabel>
                        <Select
                          labelId={`label-sort-${index}-${countryIndex}`}
                          id={`combo-box-sort-${index}-${countryIndex}`}
                          value={countryData.sort}
                          label="Sort"
                        >
                          {/* Render dropdown options for sorting */}
                          {assignment.payment.withdrawl[
                            itemIndex
                          ]?.country_sorting.map((option, idx) => (
                            <MenuItem key={idx} value={option.sort}>
                              {option.sort}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <div style={{ alignContent: "center" }}>
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={
                                  countryActions[countryData.country] ?? false
                                }
                                onChange={() => {}}
                              />
                            }
                            label={
                              Object.keys(
                                assignment.payment.withdrawl[itemIndex]
                                  .country_sorting[0]
                              )[1]
                            }
                            disabled={!countryData.action}
                          />
                        </FormGroup>
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </Card>
      </StyledDropdown>
    </div>
  );
};

export default AssignmentCards;
