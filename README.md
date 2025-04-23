# 🔐 ura-prn

A lightweight Node.js library for encrypting and signing credentials using URA certificates (`.cer`) and private keys from PKCS12 keystores (`.pfx`).  
Ideal for integrations that require secure payload delivery to Uganda Revenue Authority (URA) or similar services using public key encryption and digital signatures.

---

## ✨ Features

- 🔒 RSA encryption using X.509 `.cer` certificate
- ✍️ SHA1withRSA digital signature using `.pfx` (PKCS12) private keys
- 🧩 Fully configurable: bring your own files, credentials, and alias
- ✅ Error codes and descriptive messages for robust integrations

---

## 📦 Installation

```bash
npm install ura-prn
```

> Requires Node.js 14+ and `node-forge` as a peer dependency:

```bash
npm install node-forge
```

---

## 🚀 Quick Start

```ts
import { URAPrn } from 'ura-prn';

const ura = new URAPrn({
  certPath: './storage/ura.cer',
  pfxPath: './storage/ncdc.pfx',
  keystorePassword: '',
  alias: 'ncdc',
});

const result = ura.encryptAndSign('NCDCNCDCPWD');

console.log(result);
// {
//   encryption: '...',
//   signature: '...'
// }
```

---

## 🧰 API Reference

### `constructor(config: URAPrnConfig)`

| Param              | Type     | Description                                |
|-------------------|----------|--------------------------------------------|
| `certPath`         | `string` | Absolute or relative path to `.cer` file   |
| `pfxPath`          | `string` | Absolute or relative path to `.pfx` file   |
| `keystorePassword` | `string` | Password to unlock the PFX keystore        |
| `alias` (optional) | `string` | Alias (friendly name) for the private key  |

---

### `encrypt(plainText: string): string`

Encrypts a string using the public key from the `.cer` file.

```ts
ura.encrypt('mySecret');
```

---

### `generateSignature(encryptedText: string): string`

Generates a digital signature of the encrypted string using the private key in the `.pfx`.

```ts
ura.generateSignature(encryptedText);
```

---

### `encryptAndSign(plainText: string): { encryption: string; signature: string }`

Encrypts and signs in one go.

```ts
const result = ura.encryptAndSign('password123');
```

---

## 🛑 Error Codes

When something goes wrong, the library throws an error of type `URAPrnError` with a structured `code` and message.

| Code     | Message                                         | When it happens |
|----------|--------------------------------------------------|-----------------|
| `URA001` | Failed to load or parse the certificate file.    | `.cer` file missing or malformed |
| `URA002` | Failed to encrypt the provided plaintext.        | Public key encryption failed |
| `URA003` | Failed to load or parse the PFX keystore.        | Bad password or corrupted `.pfx` |
| `URA004` | Private key not found in keystore.               | No key found for alias |
| `URA005` | Failed to generate digital signature.            | Signing operation failed |

### Catching Errors Example

```ts
try {
  ura.encryptAndSign('data');
} catch (err: any) {
  if (err.code) {
    console.error(`Error (${err.code}): ${err.message}`);
  }
}
```

---

## 🔒 Security Notes

- Always keep your `.pfx` file and passwords secure.
- Never hardcode credentials or file paths in production.
- Consider loading secrets from environment variables or a secure vault.

---

## 👥 Contributing

Issues and PRs are welcome! Please include relevant tests or examples.

---

## 📄 License

MIT