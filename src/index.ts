import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import forge from 'node-forge';

export interface URAPrnConfig {
  certPath: string;
  pfxPath: string;
  keystorePassword: string;
  alias?: string;
}

/**
 * URA Error Codes and Descriptions
 */
export const URAError = {
  CERTIFICATE_LOAD_ERROR: {
    code: 'URA001',
    message: 'Failed to load or parse the certificate file.',
  },
  ENCRYPTION_FAILED: {
    code: 'URA002',
    message: 'Failed to encrypt the provided plaintext.',
  },
  KEYSTORE_LOAD_ERROR: {
    code: 'URA003',
    message: 'Failed to load or parse the PFX keystore.',
  },
  PRIVATE_KEY_NOT_FOUND: {
    code: 'URA004',
    message: 'Private key not found in keystore.',
  },
  SIGNATURE_FAILED: {
    code: 'URA005',
    message: 'Failed to generate digital signature.',
  },
} as const;

type URAErrorCode = keyof typeof URAError;

class URAPrnError extends Error {
  public code: string;
  constructor(code: URAErrorCode, extra?: string) {
    super(`${URAError[code].message}${extra ? ' - ' + extra : ''}`);
    this.code = URAError[code].code;
    this.name = 'URAPrnError';
  }
}

/**
 * Main URAPrn utility class
 */
export class URAPrn {
  private certPath: string;
  private pfxPath: string;
  private keystorePassword: string;
  private alias?: string;

  constructor(config: URAPrnConfig) {
    this.certPath = config.certPath;
    this.pfxPath = config.pfxPath;
    this.keystorePassword = config.keystorePassword;
    this.alias = config.alias;
  }

  encrypt(plainText: string): string {
    try {
      const certPem = fs.readFileSync(path.resolve(this.certPath), 'utf8');
      const cert = forge.pki.certificateFromPem(certPem);
      const publicKeyPem = forge.pki.publicKeyToPem(cert.publicKey);

      const encryptedBuffer = crypto.publicEncrypt(
        {
          key: publicKeyPem,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(plainText, 'utf8')
      );

      return encryptedBuffer.toString('base64');
    } catch (err: any) {
      throw new URAPrnError('ENCRYPTION_FAILED', err.message);
    }
  }

  generateSignature(textToSign: string): string {
    try {
      const pfxBuffer = fs.readFileSync(path.resolve(this.pfxPath));
      let p12Asn1;
      try {
        p12Asn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'), false);
      } catch (e: any) {
        throw new URAPrnError('KEYSTORE_LOAD_ERROR', e.message);
      }

      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, this.keystorePassword);

      let privateKey: forge.pki.PrivateKey | null = null;

      p12.safeContents.forEach((content) => {
        content.safeBags.forEach((bag) => {
          if (
            bag.type === forge.pki.oids.pkcs8ShroudedKeyBag &&
            bag.key &&
            (!this.alias || bag.attributes.friendlyName?.[0] === this.alias)
          ) {
            privateKey = bag.key;
          }
        });
      });

      if (!privateKey) {
        throw new URAPrnError('PRIVATE_KEY_NOT_FOUND');
      }

      const md = forge.md.sha1.create();
      md.update(textToSign, 'utf8');
      const signature = (privateKey as forge.pki.rsa.PrivateKey).sign(md);

      return Buffer.from(signature, 'binary').toString('base64');
    } catch (err: any) {
      if (err instanceof URAPrnError) throw err;
      throw new URAPrnError('SIGNATURE_FAILED', err.message);
    }
  }

  encryptAndSign(plainText: string): { encryption: string; signature: string } {
    const encryption = this.encrypt(plainText);
    const signature = this.generateSignature(encryption);
    return { encryption, signature };
  }
}
