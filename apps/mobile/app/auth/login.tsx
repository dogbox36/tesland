import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { api, setAuthToken } from '@/lib/api'; // Use alias from tsconfig
import "../../global.css";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            await setAuthToken(res.data.accessToken);
            Alert.alert('Success', 'Logged in successfully!');
            router.replace('/profile');
        } catch (err: any) {
            console.error(err);
            Alert.alert('Error', err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-black justify-center p-8">
            <Text className="text-red-600 text-3xl font-bold mb-8 text-center tracking-widest">LOGIN</Text>

            <View className="space-y-4">
                <View>
                    <Text className="text-gray-400 mb-2">Email</Text>
                    <TextInput
                        className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 focus:border-red-600"
                        placeholderTextColor="#666"
                        placeholder="email@example.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                </View>

                <View>
                    <Text className="text-gray-400 mb-2">Password</Text>
                    <TextInput
                        className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 focus:border-red-600"
                        placeholderTextColor="#666"
                        placeholder="********"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    className={`bg-red-600 p-4 rounded-xl mt-4 ${loading ? 'opacity-50' : ''}`}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        {loading ? 'LOGGING IN...' : 'LOGIN'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-gray-500 text-center mt-4">Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
