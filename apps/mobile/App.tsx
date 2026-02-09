import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';

export default function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:4002/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.access_token);
                Alert.alert('Success', 'Logged in successfully!');
            } else {
                Alert.alert('Error', data.message || 'Login failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Connection failed');
        }
    };

    if (token) {
        return (
            <View style={styles.container}>
                <Text>Welcome! You are logged in.</Text>
                <Button title="Logout" onPress={() => setToken(null)} />
                <StatusBar style="auto" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tesland Mobile</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button title="Login" onPress={handleLogin} />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});
