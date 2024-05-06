import React, { useState } from 'react';
import { Button, StatusBar, TextInput, TouchableOpacity,Alert } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons';
export default function App() {
  const [amount, setAmount] = useState('');
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState(null);

  const data = [
    { label: 'USD', value: 'USD' },
    { label: 'INR', value: 'INR' },
    { label: 'GBP', value: 'GBP' },
    { label: 'AUD', value: 'AUD' }
  ];

  const swapCurrencies = () => {
    const temp = fromValue;
    setFromValue(toValue);
    setToValue(temp);
  };

  const convert = () => {
    if (!amount || !fromValue || !toValue) {
      Alert.alert('Validation Error', 'Amount, From Currency, and To Currency are required.');
      return;
    }
    if (fromValue === toValue) {
      setResult(amount `${toValue}`);
    } else {
      const convertedAmount = amount * exchangeRate[fromValue][toValue];
      setResult(convertedAmount.toFixed(2) + ` ${toValue}`);
    }
  };

  const exchangeRate = {
    USD: { USD: 1, INR: 83.47, GBP: 0.8, AUD: 1.51 },
    INR: { USD: 0.012, INR: 1, GBP: 0.0095, AUD: 0.018 },
    GBP: { USD: 1.25, INR: 104.72, GBP: 1, AUD: 1.9 },
    AUD: { USD: 0.66, INR: 55.19, GBP: 0.53, AUD: 1 }
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={styles.heading}>Currency Converter</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          type="number"
          value={amount}
          onChangeText={text => {
            if (/^\d*\.?\d*$/.test(text)) {
              setAmount(text);
            }
          }}
        />
        <View style={styles.currencycontainer}>
          <Dropdown
            style={styles.dropdownInput}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={fromValue}
            onChange={item => {
              setFromValue(item.value);
            }}
            onPressIn={() => setIsActive(true)}
            onPressOut={() => setIsActive(false)}
          />
          <TouchableOpacity onPress={swapCurrencies} style={styles.swapButton}>
            <AntDesign name="swap" size={24} color="black" />
          </TouchableOpacity>
          <Dropdown
            style={styles.dropdownInput}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={toValue}
            onChange={item => {
              setToValue(item.value);
            }}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, isActive && styles.activeButton]}
          activeOpacity={0.9}
          onPressIn={() => setIsActive(true)}
          onPressOut={() => setIsActive(false)}
          onPress={convert}>
          <Text style={styles.buttonText}>Convert</Text>
        </TouchableOpacity>
      </View>
      {/* Render the result if it exists */}
      {result !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Result: {result}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '80%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: 20,
    padding: 20,
    borderRadius: 10,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: 'rgba(0,0,0,0.5)',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  dropdownInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 0.5,
  },
  currencycontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#60a5fa',
    color: 'rgba(0,0,0,0.9)',
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeButton: {
    borderRightWidth:0,
    borderBottomWidth: 0,
  },
  swapButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
