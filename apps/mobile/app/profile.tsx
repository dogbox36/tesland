import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { api, getAuthToken, removeAuthToken } from '@/lib/api'; // Use alias from tsconfig
import "../global.css";

export default function Profile() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = await getAuthToken();
        if (!token) {
            router.replace('/auth/login');
            return;
        }

        try {
            const res = await api.get('/profile');
            setProfile(res.data);
        } catch (err) {
            console.error(err);
            // If fetch fails (likely 401), redirect to login
            router.replace('/auth/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await removeAuthToken();
        router.replace('/');
    };

    if (loading) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <ActivityIndicator size="large" color="#DC2626" />
            </View>
        );
    }

    if (!profile) return null;

    return (
        <View className="flex-1 bg-black p-6">
            <Text className="text-red-600 text-3xl font-bold mb-8 text-center tracking-widest mt-8">PROFILE</Text>

            <View className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <View>
                    <Text className="text-gray-500 text-sm">Name</Text>
                    <Text className="text-white text-xl font-bold">{profile.name}</Text>
                </View>

                <View>
                    <Text className="text-gray-500 text-sm">Email</Text>
                    <Text className="text-white text-lg">{profile.email}</Text>
                </View>

                <View>
                    <Text className="text-gray-500 text-sm">Role</Text>
                    <Text className="text-red-500 font-bold uppercase">{profile.role}</Text>
                </View>
            </View>

            <TouchableOpacity
                className="bg-gray-800 p-4 rounded-xl mt-8 border border-gray-700"
                onPress={() => router.push('/')}
            >
                <Text className="text-white text-center font-bold">Back to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="bg-red-900/30 p-4 rounded-xl mt-4 border border-red-900"
                onPress={handleLogout}
            >
                <Text className="text-red-500 text-center font-bold">LOGOUT</Text>
            </TouchableOpacity>
        </View>
    );
}
