import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Link, router } from 'expo-router';
import "../global.css";

export default function Home() {
    return (
        <View className="flex-1 bg-black justify-center items-center p-6">
            <View className="mb-12 items-center">
                {/*  Icon placeholder - replace with actual asset later */}
                <View className="w-24 h-24 bg-red-600 rounded-full mb-4 justify-center items-center">
                    <Text className="text-white text-4xl font-bold">T</Text>
                </View>
                <Text className="text-red-600 text-5xl font-extrabold tracking-tighter">TESLAND</Text>
                <Text className="text-white text-lg tracking-[5px] mt-2 font-light">ELEVATE YOUR DRIVE</Text>
            </View>

            <View className="w-full space-y-4">
                <TouchableOpacity
                    className="bg-white p-4 rounded-xl items-center border border-white"
                    onPress={() => router.push('/booking')}
                >
                    <Text className="text-black font-bold text-lg tracking-widest">BOOK SERVICE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-transparent border border-red-600 p-4 rounded-xl items-center"
                    onPress={() => router.push('/quote')}
                >
                    <Text className="text-red-500 font-bold text-lg tracking-widest">GET A QUOTE</Text>
                </TouchableOpacity>

                <View className="mt-8">
                    <Link href="/auth/login" asChild>
                        <TouchableOpacity>
                            <Text className="text-gray-500 text-sm border-b border-gray-500">Already have an account? Login</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}
