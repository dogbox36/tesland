import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { api, getAuthToken } from '@/lib/api'; // Use alias from tsconfig
import "../global.css";

export default function Booking() {
    const [formData, setFormData] = useState({
        serviceType: 'Checkup',
        date: new Date().toISOString().split('T')[0], // Simple YYYY-MM-DD
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    const checkAuth = async () => {
        const token = await getAuthToken();
        if (!token) {
            Alert.alert('Login Required', 'You need to be logged in to book a service.');
            router.replace('/auth/login');
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post('/bookings', {
                ...formData,
                date: new Date(formData.date).toISOString()
            });
            Alert.alert('Success', 'Booking request sent successfully!');
            router.back();
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to create booking.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-black">
            <ScrollView className="p-6">
                <Text className="text-red-600 text-3xl font-bold mb-8 text-center tracking-widest mt-8">BOOK SERVICE</Text>

                <View className="space-y-6">
                    <View>
                        <Text className="text-gray-400 mb-2">Service Type</Text>
                        <TextInput
                            className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 focus:border-red-600"
                            value={formData.serviceType}
                            onChangeText={(text) => setFormData({ ...formData, serviceType: text })}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-400 mb-2">Date (YYYY-MM-DD)</Text>
                        <TextInput
                            className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 focus:border-red-600"
                            value={formData.date}
                            onChangeText={(text) => setFormData({ ...formData, date: text })}
                            placeholder="2024-01-01"
                            placeholderTextColor="#666"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-400 mb-2">Notes</Text>
                        <TextInput
                            className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 focus:border-red-600 h-32 text-top"
                            value={formData.notes}
                            onChangeText={(text) => setFormData({ ...formData, notes: text })}
                            multiline
                            textAlignVertical="top"
                            placeholder="Additional details..."
                            placeholderTextColor="#666"
                        />
                    </View>

                    <TouchableOpacity
                        className={`bg-red-600 p-4 rounded-xl mt-4 ${loading ? 'opacity-50' : ''}`}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            {loading ? 'BOOKING...' : 'CONFIRM BOOKING'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-gray-500 text-center mt-4">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
