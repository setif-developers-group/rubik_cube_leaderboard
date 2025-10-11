# 📧 Configuration Email Gmail

## Problème : Pas d'email reçu

Votre QR code se génère correctement, mais vous ne recevez pas l'email. C'est normal car Gmail nécessite une configuration spécifique.

## 🔧 Solution : Configurer Gmail

### **Option 1 : App Passwords (Recommandé)**

1. **Activez la vérification 2 étapes** sur votre compte Gmail
2. **Générez un App Password :**
   - Allez sur : https://myaccount.google.com/apppasswords
   - Sélectionnez "Mail" et "Autre"
   - Nommez-le "Rubiks Backend"
   - Copiez le mot de passe généré (16 caractères)


### **Option 2 : Less Secure Apps (Déprécié)**

⚠️ **Cette option sera supprimée par Google**

1. **Activez l'accès :**
   - Allez sur : https://myaccount.google.com/lesssecureapps
   - Activez "Accès moins sécurisé"

2. **Utilisez votre mot de passe Gmail normal**

### **Option 3 : Test Local (Temporaire)**

Pour les tests, j'ai modifié le code pour continuer même si l'email échoue. Le QR code est généré et sauvegardé même si l'email ne part pas.

## 🧪 Test de l'Email

### **1. Vérifiez les logs du serveur :**
```bash
# Regardez la console backend
Email sent successfully to: votre-email@test.com
```

### **2. Test direct :**
```bash
# Test de l'envoi d'email
curl -X POST http://localhost:5000/api/admin/generate-qr \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre-vrai-email@gmail.com",
    "qrData": {
      "type": "admin_session",
      "timestamp": 1695825600000
    }
  }'
```

## 📋 Configuration Actuelle

### **Variables d'environnement (.env) :**
```env
EMAIL_USER=yasmineharfouche0@gmail.com
EMAIL_PASS=Nekooooo2526@
```

### **Si ça ne marche pas :**
1. Vérifiez que l'email est correct
2. Générez un App Password Gmail
3. Mettez à jour EMAIL_PASS avec le nouveau mot de passe

## 🎯 Résultat Attendu

**Avec la bonne configuration :**
- ✅ QR code généré
- ✅ Email envoyé avec le QR code
- ✅ QR code affiché à l'écran
- ✅ Session sauvegardée en base de données

**Le système fonctionne même sans email pour les tests !** 🧪
