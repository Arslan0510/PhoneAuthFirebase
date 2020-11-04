import React, { useRef, useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";

import { Countries } from "./Countries";
import FIREBASE_CONFIG from "../firebase";

export default function AuthenticationScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [focusInput, setFocusInput] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataCountries, setDataCountries] = useState(Countries);
  const [codeCountry, setCodeCountry] = useState("+84");
  const [placeholder, setPlaceholder] = useState("902 291 011");
  let textInput = useRef(null);

  const recaptchaVerifier = React.useRef(null);

  const onShowHideModal = () => {
    setModalVisible(!modalVisible);
  };

  const onChangePhone = (number) => {
    setPhoneNumber(number);
  };
  const onPressContinue = async () => {
    const phone = codeCountry + phoneNumber;
    if (phone) {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      try {
        setVerificationId("");
        const verificationId = await phoneProvider.verifyPhoneNumber(
          phone,
          // @ts-ignore
          recaptchaVerifier.current
        );
        setVerifyInProgress(false);
        setVerificationId(verificationId);
        // verificationCodeTextInput.current?.focus();
        navigation.navigate("InputOTP", {
          verificationId: verificationId,
        });
      } catch (err) {
        setVerifyError(err);
        setVerifyInProgress(false);
      }
    }
  };

  const onChangeFocus = () => {
    setFocusInput(true);
  };
  const onChangeBlur = () => {
    setFocusInput(false);
  };

  useEffect(() => {
    textInput.focus();
  }, []);

  const filterCountries = (value) => {
    if (value) {
      const countryData = dataCountries.filter(
        (obj) => obj.en.indexOf(value) > -1 || obj.dialCode.indexOf(value) > -1
      );
      setDataCountries(countryData);
    } else {
      setDataCountries(Countries);
    }
  };
  const onCountryChange = (item) => {
    setCodeCountry(item.dialCode);
    setPlaceholder(item.mask);
    onShowHideModal();
  };

  const renderModal = () => {
    return (
      <Modal animationType='slide' transparent={false} visible={modalVisible}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalContainer}>
            <View style={styles.filterInputContainer}>
              <TextInput
                autoFocus={true}
                onChangeText={filterCountries}
                placeholder='filter'
                focusable={true}
                style={styles.filterInputStyle}
              />
            </View>
            <FlatList
              style={{ flex: 1 }}
              data={dataCountries}
              extraData={dataCountries}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => onCountryChange(item)}>
                  <View style={styles.countryModalStyle}>
                    <View style={styles.modalItemContainer}>
                      <Text style={styles.modalItemName}>{item.en}</Text>
                      <Text style={styles.modalItemCode}>{item.dialCode}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          </View>
          <TouchableOpacity
            onPress={onShowHideModal}
            style={styles.closeButtonStyle}>
            <Text style={styles.closeTextStyle}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={50}
        behavior={"padding"}
        style={styles.containerAvoidingView}>
        <Text style={styles.textTitle}>
          {"Please input your mobile phone number"}
        </Text>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={FIREBASE_CONFIG}
        />
        <View style={styles.containerInput}>
          <TouchableOpacity onPress={onShowHideModal}>
            <View style={styles.openDialogView}>
              <Text>{codeCountry + " |"}</Text>
            </View>
          </TouchableOpacity>
          {renderModal()}
          <TextInput
            ref={(input) => (textInput = input)}
            style={styles.phoneInput}
            placeholder={placeholder}
            keyboardType='numeric'
            value={phoneNumber}
            onChangeText={onChangePhone}
            secureTextEntry={false}
            onFocus={onChangeFocus}
            onBlur={onChangeBlur}
            autoFocus={focusInput}
          />
        </View>
        <View style={styles.viewButton}>
          <TouchableOpacity onPress={onPressContinue}>
            <View
              style={[
                styles.btnContinue,
                { backgroundColor: phoneNumber ? "#244DB7" : "grey" },
              ]}>
              <Text style={{ color: "#fff", alignItems: "center" }}>
                Continue
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerAvoidingView: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  textTitle: {
    marginBottom: 50,
    marginTop: 50,
    fontSize: 16,
  },
  containerInput: {
    flexDirection: "row",
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#244DB7",
  },
  openDialogView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  phoneInput: {
    marginLeft: 5,
    flex: 1,
    height: 50,
  },
  viewButton: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 50,
  },
  btnContinue: {
    width: 150,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#244DB7",
  },
  modalContainer: {
    paddingTop: 15,
    paddingLeft: 25,
    paddingRight: 25,
    flex: 1,
    backgroundColor: "white",
  },
  filterInputStyle: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
    color: "#424242",
  },
  countryModalStyle: {
    flex: 1,
    borderColor: "black",
    borderTopWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalItemContainer: {
    flex: 1,
    paddingLeft: 5,
    flexDirection: "row",
  },
  modalItemName: {
    flex: 1,
    fontSize: 16,
  },
  modalItemCode: {
    fontSize: 16,
  },
  filterInputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonStyle: {
    padding: 12,
    alignItems: "center",
  },
  closeTextStyle: {
    padding: 5,
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
});
