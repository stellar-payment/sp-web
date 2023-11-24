type SecuredAPIResponse = {
    data: string
    tag: string
    secret_key: string
}


type EncryptDataPayload = {
    data: string,
    partner_id: string,
}

type EncryptedData = {
    data: string, 
    tag: string, 
    partner_id: string,
    keypair_hash: string,
};

type DecryptDataPayload = {
    keypair_hash: string,
    partner_id: string,
    data: string,
    tag: string
}

type DecryptedData = {
    data: string
}

export type {
    SecuredAPIResponse,
    EncryptDataPayload,
    EncryptedData,
    DecryptDataPayload,
    DecryptedData
};
