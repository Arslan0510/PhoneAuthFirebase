import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as firebase from "firebase";

import Splash from "./screens/splash";
import AuthenticationScreen from "./screens/AuthenticationScreen";
import InputOTPScreen from "./screens/InputOTPScreen";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  const Stack = createStackNavigator();

  const authListener = () => {
    firebase.auth().onAuthStateChanged((user) => {
      console.log("user", user);
      if (user) {
        setUserToken(user);
      } else {
        setUserToken(null);
      }
    });
  };

  React.useEffect(() => {
    authListener();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <Splash />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Authentication'>
        {userToken ? (
          <Stack.Screen
            name='Home'
            component={HomeScreen}
            options={{ title: "Home", headerBackTitle: "", headerLeft: null }}
          />
        ) : (
          <>
            <Stack.Screen
              name='Authentication'
              component={AuthenticationScreen}
            />
            <Stack.Screen
              name='InputOTP'
              component={InputOTPScreen}
              options={{ title: "Input OTP", headerBackTitle: "" }}
            />{" "}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
