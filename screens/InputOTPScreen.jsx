import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as firebase from "firebase";

export default function InputOTPScreen({ navigation, route }) {
  const defaultCountdown = 30;
  let clockCall = null;
  const [internalVal, setInternalVal] = useState("");
  const [enableResend, setEnableResend] = useState(false);
  const [countdown, setCountdown] = useState(defaultCountdown);
  const [verificationCode, setVerificationCode] = React.useState("");
  let textInput = useRef(null);
  const lengthInput = 6;

  const onChangeText = async (val) => {
    console.log("InputOTPScreen -> val", val);
    setInternalVal(val);
    setVerificationCode(val);
    try {
      if (verificationCode.length === 6) {
        const credential = firebase.auth.PhoneAuthProvider.credential(
          route.params.verificationId,
          verificationCode
        );
        const authResult = await firebase
          .auth()
          .signInWithCredential(credential);
        setConfirmInProgress(false);
        if (authResult) {
          Alert.alert("Phone authentication successful!");
        }
        // signUp();
      } else {
        Alert.alert("Please enter a 6 digit OTP code.");
      }
    } catch (err) {
      setConfirmError(err);
      setConfirmInProgress(false);
    }
  };

  useEffect(() => {
    textInput.focus();
    clockCall = setInterval(() => {
      decrementClock();
    }, 1000);
    return () => {
      clearInterval(clockCall);
    };
  });

  const onResendOTP = () => {
    if (enableResend) {
      setCountdown(defaultCountdown);
      setEnableResend(false);
      clearInterval(clockCall);
      clockCall = setInterval(() => {
        decrementClock();
      }, 1000);
    }
  };
  const onChangeNumber = () => {
    setInternalVal("");
  };

  const decrementClock = () => {
    if (countdown === 0) {
      setEnableResend(true);
      setCountdown(0);
      clearInterval(clockCall);
    } else {
      setCountdown(countdown - 1);
    }
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={50}
        behavior={"padding"}
        style={styles.containerAvoidingView}>
        <Text style={styles.textTitle}>
          {"Input your OTP code here sent via SMS"}
        </Text>
        <View style={styles.containerInput}>
          <TextInput
            ref={(input) => (textInput = input)}
            style={styles.textInput}
            keyboardType='numeric'
            value={internalVal}
            maxlength={lengthInput}
            onChangeText={onChangeText}
            returnKeyType='done'
          />
          <View style={styles.inputContainer}>
            {Array(lengthInput)
              .fill()
              .map((data, index) => (
                <View
                  key={index}
                  style={[
                    styles.cellView,
                    {
                      borderBottomColor:
                        index === internalVal.length ? "grey" : "#244DB7",
                    },
                  ]}>
                  <Text
                    style={styles.cellText}
                    onPress={() => textInput.focus()}>
                    {internalVal && internalVal.length > 0
                      ? internalVal[index]
                      : ""}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        <View style={styles.bottomView}>
          <TouchableOpacity onPress={onChangeNumber}>
            <View style={styles.btnChangeNumber}>
              <Text style={styles.textChange}>Change Number</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onResendOTP}>
            <View style={styles.btnResend}>
              <Text
                style={[
                  styles.textResend,
                  { color: enableResend ? "#234DB7" : "gray" },
                ]}>
                Resend OTP ({countdown})
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
  textInput: {
    width: 0,
    height: 0,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cellView: {
    alignItems: "center",
    borderBottomWidth: 1.5,
    justifyContent: "center",
    margin: 5,
    paddingVertical: 11,
    width: 40,
  },
  cellText: {
    textAlign: "center",
    fontSize: 16,
  },
  bottomView: {
    flexDirection: "row",
    flex: 1,
    // justifyContent: "flex-end",
    marginBottom: 40,
    alignItems: "flex-end",
  },
  btnChangeNumber: {
    width: 150,
    height: 50,
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  textChange: {
    color: "#234DB7",
    alignItems: "center",
    fontSize: 15,
  },
  btnResend: {
    width: 150,
    height: 50,
    borderRadius: 10,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  textResend: {
    alignItems: "center",
    fontSize: 15,
  },
});
