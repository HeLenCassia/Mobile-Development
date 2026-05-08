import React, { useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
    const [expenses, setExpenses] = useState([]);

    const addExpense = (expense) => {
        setExpenses((current) => [expense, ...current]);
    };

    const deleteExpense = (id) => {
        setExpenses((current) => current.filter((item) => item.id !== id));
    };

    const total = useMemo(
        () => expenses.reduce((sum, item) => sum + Number(item.amount), 0),
        [expenses]
    );

    return (
        <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator>
                <Stack.Screen name="Lista" options={{ title: 'CONTROLE DE GASTOS' }}>
                    {(props) => (
                        <HomeScreen
                            {...props}
                            expenses={expenses}
                            total={total}
                            onDelete={deleteExpense}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Adicionar" options={{ title: 'NOVO GASTO' }}>
                    {(props) => <FormScreen {...props} onSave={addExpense} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

function HomeScreen({ navigation, expenses, total, onDelete }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>TOTAL GASTO</Text>
                <Text style={styles.total}>R$ {total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('Adicionar')}
            >
                <Text style={styles.addButtonText}>ADICIONAR GASTO</Text>
            </TouchableOpacity>

            {expenses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum gasto registrado ainda.</Text>
                </View>
            ) : (
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <View style={styles.itemCard}>
                            <View>
                                <Text style={styles.itemDescription}>{item.description}</Text>
                                <Text style={styles.itemAmount}>R$ {Number(item.amount).toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => onDelete(item.id)}
                            >
                                <Text style={styles.deleteButtonText}>EXCLUIR</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

function FormScreen({ navigation, onSave }) {
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        const trimmedDescription = description.trim();
        const numericValue = parseFloat(value.replace(',', '.'));

        if (trimmedDescription.length === 0) {
            setError('A descrição não pode ficar vazia.');
            return;
        }

        if (Number.isNaN(numericValue) || numericValue <= 0) {
            setError('O valor precisa ser maior que zero.');
            return;
        }

        onSave({
            id: String(Date.now()),
            description: trimmedDescription,
            amount: numericValue
        });

        setDescription('');
        setValue('');
        setError('');
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>DESCRIÇÃO</Text>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Ex: Almoço"
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>VALOR</Text>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={setValue}
                    placeholder="Ex: 42.90"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>SALVAR</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9fb'
    },
    header: {
        marginBottom: 16,
        borderRadius: 12,
        padding: 18,
        backgroundColor: '#024100'
    },
    title: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 8
    },
    total: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: '700'
    },
    addButton: {
        marginBottom: 12,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#520014',
        alignItems: 'center'
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600'
    },
    listContainer: {
        paddingBottom: 24
    },
    itemCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2
    },
    itemDescription: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4
    },
    itemAmount: {
        fontSize: 14,
        color: '#555'
    },
    deleteButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#ea4335'
    },
    deleteButtonText: {
        color: '#ffffff',
        fontWeight: '600'
    },
    emptyContainer: {
        marginTop: 32,
        alignItems: 'center'
    },
    emptyText: {
        color: '#666',
        fontSize: 16
    },
    formGroup: {
        marginBottom: 16
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: '600'
    },
    input: {
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16
    },
    saveButton: {
        marginTop: 8,
        paddingVertical: 16,
        borderRadius: 10,
        backgroundColor: '#042b5e',
        alignItems: 'center'
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700'
    },
    errorText: {
        marginBottom: 12,
        color: '#d93025',
        fontSize: 14,
        fontWeight: '600'
    }
});
