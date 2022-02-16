import React, { useState, useEffect } from "react";
import { FormStep, Dropdown, Loader, RadioOrSelect, CitizenInfoLabel } from "@egovernments/digit-ui-react-components";

const SelectPaymentPreference = ({ config, formData, t, onSelect, userType }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { data: PaymentTypeData, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PaymentType");
  const [paymentType, setPaymentType] = useState(formData?.paymentType);

  useEffect(() => {
    if (!isLoading && PaymentTypeData) {
      const preFilledPaymentType = PaymentTypeData.filter(
        (paymentType) => paymentType.code === (formData?.selectPaymentPreference?.code || formData?.selectPaymentPreference)
      )[0];
      setPaymentType(preFilledPaymentType);
    }
  }, [formData?.selectPaymentPreference, PaymentTypeData]);

  const selectPaymentType = (value) => {
    setPaymentType(value);
    if (userType === "employee") {
      onSelect(config.key, value);
      onSelect("paymentDetail", null);
    }
  };

  const onSkip = () => {
    onSelect();
  };

  const onSubmit = () => {
    onSelect(config.key, paymentType);
  };

  if (isLoading) {
    return <Loader />;
  }
  if (userType === "employee") {
    return <Dropdown isMandatory={true} option={PaymentTypeData} optionKey="i18nKey" select={selectPaymentType} selected={paymentType} t={t} />;
  }
  return (
    <React.Fragment>
      <FormStep config={config} onSelect={onSubmit} onSkip={onSkip} isDisabled={!paymentType} t={t}>
        <RadioOrSelect
          options={PaymentTypeData}
          selectedOption={paymentType}
          optionKey="i18nKey"
          onSelect={selectPaymentType}
          t={t}
          isMandatory={config.isMandatory}
        />
      </FormStep>
      {paymentType && paymentType.name === "Pay Now" && <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("CS_CHECK_INFO_PAY_NOW", paymentType)} />}
      {paymentType && paymentType.name === "Pay on Service" && <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("CS_CHECK_INFO_PAY_LATER", paymentType)} />}
    </React.Fragment>
  );
};

export default SelectPaymentPreference;