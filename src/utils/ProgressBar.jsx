import React from "react";
import StepProgressBar from "react-step-progress";

export const ProgressB = () => {
  function step2Validator() {
    // return a boolean
    return true;
  }

  function onFormSubmit() {
    // handle the submit logic here
    // This function will be executed at the last step
    // when the submit button (next button in the previous steps) is pressed
    console.log(true);
  }

  return (
    <StepProgressBar
      startingStep={0}
      onSubmit={onFormSubmit}
      wrapperClass={"wClass"}
      progressClass={"pClass"}
      stepClass={"sClass"}
      labelClass={"lClass"}
      subtitleClass={"subClass"}
      contentClass={"cClass"}
      buttonWrapperClass={"bClass"}
      primaryBtnClass={"prClass"}
      secondaryBtnClass={"sbtClass"}
      previousBtnName={"pbClass"}
      nextBtnName={"nbClass"}
      submitBtnName={"sbClass"}
      steps={[
        {
          label: "Get started",
          name: "Get started",
          validator: step2Validator,
          //   content: step1Content,
        },
        {
          label: "Email verification",
          name: "Email verification",
          validator: onFormSubmit,

          //   content: step2Content,
        },
      ]}
    />
  );
};
