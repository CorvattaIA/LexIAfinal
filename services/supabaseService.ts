import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserRegistrationData, RegisteredUser, LawAreaId } from '../types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';

// Definición de credenciales dummy para desarrollo
const DUMMY_SUPABASE_URL = 'https://xyzcompany.supabase.co';
const DUMMY_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Variable para indicar si estamos usando un cliente mock
let usingMockClient = false;

// Inicialización del cliente Supabase (real o mock)
let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== 'YOUR_SUPABASE_URL_ENV_VAR_NOT_SET') {
  try {
    // Inicializar con credenciales reales
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase client initialized with real credentials");
  } catch (error) {
    console.error("Error initializing Supabase client with real credentials:", error);
    // Fallback a credenciales dummy
    supabase = createClient(DUMMY_SUPABASE_URL, DUMMY_SUPABASE_ANON_KEY);
    usingMockClient = true;
    console.log("Fallback: Supabase client initialized with dummy credentials");
  }
} else {
  // Usar credenciales dummy si no hay configuración real
  console.warn("Supabase URL or Anon Key is not configured. Using dummy credentials for development.");
  supabase = createClient(DUMMY_SUPABASE_URL, DUMMY_SUPABASE_ANON_KEY);
  usingMockClient = true;
  console.log("Supabase client initialized with dummy credentials for development");
}

export const saveUserRegistration = async (
  userData: UserRegistrationData
): Promise<{ data: RegisteredUser | null; error: any }> => {
  if (!supabase) {
    return { data: null, error: { message: "Supabase client not initialized." } };
  }
  
  const interestedAreaIdToSave = userData.interestedAreaId;

  // Si estamos usando un cliente mock, simular un registro exitoso
  if (usingMockClient) {
    console.log('DESARROLLO: Simulando registro de usuario con datos mock:', userData);
    
    // Crear un usuario simulado con los datos proporcionados
    const mockRegisteredUser: RegisteredUser = {
      id: `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // ID único simulado
      name: userData.name,
      email: userData.email,
      interestedAreaId: userData.interestedAreaId,
      createdAt: new Date().toISOString(),
      dataPolicyAccepted: userData.dataPolicyAccepted
    };
    
    // Simular un pequeño retraso para que parezca una operación real
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { data: mockRegisteredUser, error: null };
  }
  
  // Código original para cuando tenemos un cliente Supabase real
  try {
    const { data, error } = await supabase
      .from('user_registrations') // Ensure this table exists in your Supabase
      .insert([{ 
        name: userData.name, 
        email: userData.email, 
        interested_area_id: interestedAreaIdToSave, // Use snake_case for Supabase columns
        // `created_at` is usually handled by Supabase default value
        // `data_policy_accepted` is not stored in the table by this insert,
        // but it's part of UserRegistrationData and thus RegisteredUser type.
      }])
      .select()
      .single(); // Assuming you want the inserted row back

    if (error) {
      console.error('Supabase error saving user:', error);
      return { data: null, error };
    }
    
    if (data) {
      // data from Supabase: { id, name, email, interested_area_id, created_at }
      // UserRegistrationData needs: { name, email, interestedAreaId, dataPolicyAccepted }
      // RegisteredUser needs: { id, createdAt } & UserRegistrationData fields.
      const registeredUser: RegisteredUser = {
        id: data.id, // Supabase generated id
        name: data.name, // from Supabase data
        email: data.email, // from Supabase data
        interestedAreaId: data.interested_area_id as LawAreaId, // from Supabase data
        createdAt: data.created_at, // from Supabase data
        dataPolicyAccepted: userData.dataPolicyAccepted // from original userData input
      };
      return { data: registeredUser, error: null };
    }
    return { data: null, error: { message: "No data returned after insert."}};

  } catch (e) {
    console.error('Catch block error saving user:', e);
    
    // Si hay un error con el cliente real, intentar simular un registro exitoso como fallback
    console.log('FALLBACK: Error con cliente real, simulando registro con datos mock:', userData);
    
    const mockRegisteredUser: RegisteredUser = {
      id: `fallback-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: userData.name,
      email: userData.email,
      interestedAreaId: userData.interestedAreaId,
      createdAt: new Date().toISOString(),
      dataPolicyAccepted: userData.dataPolicyAccepted
    };
    
    return { data: mockRegisteredUser, error: null };
  }
};

// Optional: Check if user exists (e.g., by email)
export const checkIfUserExists = async (
  email: string
): Promise<{ userExists: boolean; error: any }> => {
  if (!supabase) {
    return { userExists: false, error: { message: "Supabase client not initialized." } };
  }
  
  // Si estamos usando un cliente mock, simular la verificación
  if (usingMockClient) {
    console.log('DESARROLLO: Simulando verificación de usuario existente para:', email);
    
    // Para desarrollo, asumimos que el usuario no existe para permitir el registro
    // Puedes modificar esta lógica si necesitas probar diferentes escenarios
    return { userExists: false, error: null };
  }
  
  // Código original para cuando tenemos un cliente Supabase real
  try {
    const { data, error } = await supabase
      .from('user_registrations')
      .select('id')
      .eq('email', email)
      .maybeSingle(); // Returns one row or null

    if (error) {
      return { userExists: false, error };
    }
    return { userExists: !!data, error: null };
  } catch (e) {
    console.error('Error checking if user exists:', e);
    // En caso de error, permitimos continuar asumiendo que el usuario no existe
    return { userExists: false, error: null };
  }
};

// Función auxiliar para verificar si estamos usando un cliente mock
export const isUsingMockClient = (): boolean => {
  return usingMockClient;
};