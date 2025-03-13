import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';
import { getDateKey } from '../utils/date';

interface LeaderboardEntry {
    name: string;
    date: string;
    score: number;
}

type Props = StackScreenProps<RootStackParamList, 'Leaderboard'>;

export default function LeaderboardScreen({ navigation }: Props) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const loadLeaderboard = async () => {
            const dateKey = getDateKey();
            const storedLeaderboard = await AsyncStorage.getItem('leaderboard');
            let parsedLeaderboard: LeaderboardEntry[] = storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
            parsedLeaderboard = parsedLeaderboard.filter(entry => entry.date === dateKey);
            parsedLeaderboard.sort((a, b) => b.score - a.score);
            setLeaderboard(parsedLeaderboard);
        };

        loadLeaderboard();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Today's Leaderboard</Text>
            {leaderboard.length === 0 ? (
                <Text style={styles.noData}>No scores yet. Be the first to play!</Text>
            ) : (
                <FlatList
                    data={leaderboard}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={[styles.leaderboardItem, index === 0 && styles.firstPlace, index === 1 && styles.secondPlace, index === 2 && styles.thirdPlace]}>
                            <Text style={styles.rank}>#{index + 1}</Text>
                            <Text style={styles.playerName}>{item.name || 'Unknown Player'}</Text>
                            <Text style={styles.score}>{item.score} / 10</Text>
                        </View>
                    )}
                />
            )}
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.btn}>
                <Text style={styles.btnText}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e3c72',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    noData: {
        fontSize: 18,
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    leaderboardItem: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        width: '90%',
        maxWidth: 400,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },

    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3c72',
        flex: 1,
        minWidth: 120,
        textAlign: 'center',
    },

    firstPlace: {
        backgroundColor: '#FFD700',
    },
    secondPlace: {
        backgroundColor: '#C0C0C0',
    },
    thirdPlace: {
        backgroundColor: '#CD7F32',
    },
    rank: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e3c72',
        width: 40,
        textAlign: 'center',
    },
    score: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4a90e2',
        textAlign: 'right',
    },
    btn: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#4a90e2',
        borderRadius: 5,
    },
    btnText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
    },
});