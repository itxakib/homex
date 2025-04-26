import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginUser from './components/auth/login_user';
import SplashScreen from './components/splash_screen';
import CarouselComponent from './components/image_coursel';
import AppCarousel from './components/image_coursel';
import OnboardingCarousel from './components/image_coursel';
import AuthScreen from './components/auth/login_user';
import Home from './components/home';
import Tab_Navigation from './components/tab_navigation';
import ChatScreen from './components/chat_screen';
import Profile from './components/profile';
import ServiceProviderLogin from './components/serviceprovider/auth/serviceproviderlogin';
import ServiceProviderDashboard from './components/serviceprovider/serviceprovider_dashboard';
import Cnic_Verification from './components/serviceprovider/auth/cnic_verifciation';

const Stack = createNativeStackNavigator();

export default function App() {
const [issplashshow,setissplashshow]=useState(true)
useEffect(()=>{
  setTimeout(()=>{
   setissplashshow(false)
  },3000)
})

  return (

    <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    {issplashshow ? (
          <Stack.Screen name="splash_screen" component={SplashScreen} />
        ) : (
          <Stack.Screen name="image_coursel" component={OnboardingCarousel} />
        )}
        <Stack.Screen name="login_user" component={AuthScreen}/>
        <Stack.Screen name="profile" component={Profile}/>
        <Stack.Screen name="serviceproviderlogin" component={ServiceProviderLogin}/>
          <Stack.Screen name="chat_screen" component={ChatScreen} />
          <Stack.Screen name="tab_navigation" component={Tab_Navigation}/>
          <Stack.Screen name="serviceprovider_dashboard" component={ServiceProviderDashboard}/>
          <Stack.Screen name="cnic_verifciation" component={Cnic_Verification}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

