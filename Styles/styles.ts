import { StyleSheet } from 'react-native';

// Colores de la aplicación
export const colors = {
  primary: '#1a1a2e',
  accent: '#00d4ff',
  background: '#f5f5f5',
  white: '#ffffff',
  black: '#000',
  danger: '#ff4757',
  gray: '#666',
  darkGray: '#333',
  lightGray: '#b8b8b8',
  cardBackground: '#4dbeffff',
  plateBackground: 'rgba(0, 76, 255, 1)',
};

// Estilos de App
export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 44,
    paddingBottom: 16,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.lightGray,
    fontWeight: '300',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 14,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 6,
    marginTop: 8,
  },
  pickerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.accent,
    marginBottom: 12,
  },
  picker: {
    height: 50,
    color: colors.primary,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  closeButton: {
    backgroundColor: colors.danger,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputField: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.accent,
    padding: 12,
    fontSize: 15,
    color: colors.primary,
    marginBottom: 12,
  },
});

// Estilos de Coche
export const cocheStyles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },
  marca: {
    fontSize: 22,
    color: colors.black,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  modelo: {
    fontSize: 16,
    color: colors.darkGray,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    width: '100%',
  },
  cocheImage: {
    width: '100%',
    height: 180,
  },
  matricula: {
    backgroundColor: colors.plateBackground,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
    borderRadius: 8,
    textAlign: 'center',
    alignSelf: 'center',
    minWidth: 150,
    marginBottom: 12,
  },
  kilometros: {
    fontSize: 22,
    color: colors.black,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 13,
    color: colors.darkGray,
    fontWeight: '400',
    marginBottom: 2,
  },
  kilometrosContainer: {
    alignItems: 'center',
    marginTop: 6,
  },
});

// Estilos de Documento
export const documentoStyles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  titulo: {
    fontSize: 18,
    color: colors.black,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descripcion: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 8,
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  estadoPin: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  estadoPinFirmado: {
    backgroundColor: 'green',
  },
  estadoPinSinFirmar: {
    backgroundColor: 'orange',
  },
  estadoTexto: {
    fontSize: 15,
    color: colors.black,
  },
  firmarButton: {
    backgroundColor: '#00d4ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 5,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    alignSelf: 'flex-end',
    borderColor: '#ffffffff',
    borderWidth: 1,
  },
  firmarButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

// Estilos de Cliente
export const clienteStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  imageContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#00d4ff',
  },
  nombre: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#1a1a2e',
  },
  apellidos: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImageLarge: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#00d4ff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cameraButtonText: {
    fontSize: 24,
  },
  modalNombre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalApellidos: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00d4ff',
    marginTop: 20,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  backButtonText: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

// Estilos adicionales para modal de firma en Documento
export const firmaModalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#ff4757',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#00d4ff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00d4ff',
  },
  cancelButtonText: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// CSS para SignatureScreen WebView
export const signatureWebStyle = `
  .m-signature-pad {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .m-signature-pad--body {
    flex: 1;
    border: 1px solid #e8e8e8;
  }
  .m-signature-pad--footer {
    display: none !important;
  }
  body, html {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }`;
