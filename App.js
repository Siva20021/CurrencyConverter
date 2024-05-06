import React, { useEffect, useState } from 'react';
import { Button, TextInput, TouchableOpacity, Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [amount, setAmount] = useState('');
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const clearHistory = () => {
    setHistory([]);
    AsyncStorage.removeItem('history');
  };
  

  const data = [
    { label: 'USD', value: 'USD' },
    { label: 'INR', value: 'INR' },
    { label: 'GBP', value: 'GBP' },
    { label: 'AUD', value: 'AUD' }
  ];

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading history from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const saveHistory = async () => {
    try {
      await AsyncStorage.setItem('history', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history to AsyncStorage:', error);
    }
  };

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
    const convertedAmount = fromValue === toValue ? amount : amount * exchangeRate[fromValue][toValue];
    const historyItem = { from: fromValue, to: toValue, amount: amount, result: convertedAmount.toFixed(2) };
    setHistory([...history, historyItem]);
    setResult(`${convertedAmount.toFixed(2)} ${toValue}`);
    saveHistory();
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
          onPress={convert}>
          <Text style={styles.buttonText}>Convert</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Button title="History" onPress={() => setModalVisible(true)} />
        </TouchableOpacity>
      </View>
      
      {result !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Result: {result}</Text>
        </View>
      )}

      
      <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>History</Text>
            <ScrollView style={styles.historyContainer}>
              {history.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text>From: {item.from}</Text>
                  <Text>To: {item.to}</Text>
                  <Text>Amount: {item.amount}</Text>
                  <Text>Result: {item.result}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.button}
              onPress={clearHistory}>
              <Text style={styles.buttonText}>Clear History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // Styles for the Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    maxHeight: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyContainer: {
    width: '100%',
    maxHeight: '80%',
  },
  historyItem: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderWidth:1,
    padding: 10,
    width:"100%",
    borderRadius:10,
    marginBottom: 10,
  },
  closeButton: {
    top:0,
    right:0,
    backgroundColor: '#60a5fa',
    paddingVertical: 10,
    position: 'absolute',
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
