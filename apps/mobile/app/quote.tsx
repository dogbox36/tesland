import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { api } from '@/lib/api'; // Use alias from tsconfig
import "../global.css";

export default function Quote() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        model: '',
        serviceType: 'Custom Modification',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.model || !formData.message) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/quotes', formData);
            Alert.alert('Success', 'Quote request sent successfully!');
            router.back();
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to send quote request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-black">
            <ScrollView className="p-6">
                <Text className="text-red-600 text-3xl font-bold mb-8 text-center tracking-widest mt-8">GET QUOTE</Text>

                <View className="space-y-4 pb-12">
                    <TextInput
                        className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 focus:border-red-600"
                        placeholder="Full Name *"
                        placeholderTextColor="#666"
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />

                    <TextInput
                        className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 focus:border-red-600"
                        placeholder="Email Address *"
                        placeholderTextColor="#666"
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 focus:border-red-600"
                        placeholder="Phone Number"
                        placeholderTextColor="#666"
                        value={formData.phone}
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        keyboardType="phone-pad"
                    />

                    <TextInput
                        className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 focus:border-red-600"
                        placeholder="Tesla Model (e.g. Model 3) *"
                        placeholderTextColor="#666"
                        value={formData.model}
                        onChangeText={(text) => setFormData({ ...formData, model: text })}
                    />

                    <TextInput
                        className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 focus:border-red-600"
                        placeholder="Service Type *"
                        placeholderTextColor="#666"
                        value={formData.serviceType}
                        onChangeText={(text) => setFormData({ ...formData, serviceType: text })}
                    />

                    <TextInput
                        className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 focus:border-red-600 h-32 text-top"
                        placeholder="Describe your request... *"
                        placeholderTextColor="#666"
                        value={formData.message}
                        onChangeText={(text) => setFormData({ ...formData, message: text })}
                        multiline
                        textAlignVertical="top"
                    />

                    <TouchableOpacity
                        className={`bg-red-600 p-4 rounded-xl mt-4 ${loading ? 'opacity-50' : ''}`}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            {loading ? 'SENDING...' : 'SUBMIT REQUEST'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.back()} className="mb-8">
                        <Text className="text-gray-500 text-center mt-4">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
