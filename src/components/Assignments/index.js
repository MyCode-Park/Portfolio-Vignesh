import React from "react";
import { useState } from "react";
import {
  Container,
  Wrapper,
  Title,
  Desc,
  CardContainer,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from "./AssignmentStyle";
import AssignmentCard from "../Cards/AssignmentCards";
import { transcation } from "../../data/constants";

const Assignments = ({ openModal, setOpenModal }) => {
  const [toggle, setToggle] = useState("all");
  return (
    <Container id="assignment">
      <Wrapper>
        <Title>Assignments</Title>
        <Desc>
          I have worked on a wide range of projects. From web apps to android
          apps. Here are some of my projects.
        </Desc>
        <CardContainer>
          {toggle === "all" &&
            transcation.map((assignment) => (
              <AssignmentCard
                assignment={assignment}
                // openModal={openModal}
                // setOpenModal={setOpenModal}
              />
            ))}
        </CardContainer>
      </Wrapper>
    </Container>
  );
};

export default Assignments;
