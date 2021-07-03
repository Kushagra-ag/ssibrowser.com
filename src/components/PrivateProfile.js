// @TODO: Same, delete this eslint's disable statement once props interfaces are defined. Check this with @Tralcan
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import * as DKMS from '../lib/dkms';
import * as SmartWeave from 'smartweave';

function PrivateProfile({
    username,
    domain,
    account,
    arweave,
    arconnect,
    keyfile
}) {
    const [update, setUpdate] = useState('');
    const handleUpdate = (event) => {
        setUpdate(event.target.value);
    };

    const [newAddress, setNewAddress] = useState('');
    const handleNewAddress = (event) => {
        setNewAddress(event.target.value);
    };

    const [keyId, setKeyId] = useState('');
    const handleKeyId = (event) => {
        setKeyId(event.target.value);
    };

    const [specificId, setSpecificId] = useState('');
    const handleSpecificId = (event) => {
        setSpecificId(event.target.value);
    };

    const emptyMessage = {
        firstName: '',
        lastName: '',
        streetName: '',
        buildingNumber: '',
        country: ''
    };
    const [ivms101, setIvms101] = useState(emptyMessage);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [streetName, setStreetName] = useState('');
    const [buildingNumber, setBuildingNumber] = useState('');
    const [country, setCountry] = useState('');
    const handleFirstName = (event) => {
        setFirstName(event.target.value);
    };
    const handleLastName = (event) => {
        setLastName(event.target.value);
    };
    const handleStreetName = (event) => {
        setStreetName(event.target.value);
    };
    const handleBuildingNumber = (event) => {
        setBuildingNumber(event.target.value);
    };
    const handleCountry = (event) => {
        setCountry(event.target.value);
    };

    const [updateAddressLegend, setUpdateAddressLegend] = useState('update');
    const [updateAddressButton, setUpdateAddressButton] =
        useState('button primary');
    const [sendKey, setSendKey] = useState('encrypt & send to permawallet');
    const [newKeyButton, setNewKeyButton] = useState('button primary');
    const [savePassportLegend, setSavePassportLegend] = useState('save');
    const [savePassportButton, setSavePassportButton] =
        useState('button primary');
    const [updatePassportLegend, setUpdatePassportLegend] = useState('update');
    const [updatePassportButton, setUpdatePassportButton] =
        useState('button primary');

    return (
        <div id="main">
            <h2
                style={{ width: '100%', textAlign: 'center' }}
                className="major"
            >
                {username}.{domain} settings
            </h2>
            <p style={{ width: '100%' }}>
                Hi {username}.{domain}, welcome back!
            </p>
            <section style={{ width: '100%', marginTop: '4%' }}>
                <h4 className="major">Update an address</h4>
                <form>
                    <div className="fields">
                        <div className="field half">
                            <select onChange={handleUpdate}>
                                <option value="">Select</option>
                                <option value="ssiPermawallet">
                                    SSI address in permawallet
                                </option>
                            </select>
                        </div>

                        {update !== '' && (
                            <div className="field half">
                                <input
                                    type="text"
                                    placeholder="New address"
                                    onChange={handleNewAddress}
                                />
                            </div>
                        )}
                    </div>
                    <ul className="actions">
                        <li>
                            <input
                                type="button"
                                className={updateAddressButton}
                                value={updateAddressLegend}
                                onClick={async () => {
                                    try {
                                        if (
                                            keyfile === '' &&
                                            arconnect === ''
                                        ) {
                                            throw new Error(
                                                `You have to connect with ArConnect or your keyfile.`
                                            );
                                        }

                                        let input;
                                        let contractId;
                                        switch (update) {
                                            case 'ssiPermawallet':
                                                input = {
                                                    function: 'ssi',
                                                    ssi: newAddress
                                                };
                                                contractId = account.wallet;
                                                break;
                                            default:
                                                throw new Error(
                                                    'Wrong selection.'
                                                );
                                        }
                                        let tx;
                                        if (arconnect !== '') {
                                            tx = await arweave
                                                .createTransaction({
                                                    data: Math.random()
                                                        .toString()
                                                        .slice(-4)
                                                })
                                                .catch((err) => {
                                                    throw err;
                                                });
                                            tx.addTag('Dapp', 'ssiprotocol');
                                            tx.addTag(
                                                'App-Name',
                                                'SmartWeaveAction'
                                            );
                                            tx.addTag('App-Version', '0.3.0');
                                            tx.addTag(
                                                'Contract',
                                                contractId.toString()
                                            );
                                            tx.addTag(
                                                'Input',
                                                JSON.stringify(input)
                                            );

                                            await arweave.transactions
                                                .sign(tx)
                                                .catch((err) => {
                                                    throw err;
                                                });
                                            await arweave.transactions
                                                .post(tx)
                                                .catch((err) => {
                                                    throw err;
                                                });
                                            tx = tx.id;
                                        } else {
                                            tx = await SmartWeave.interactWrite(
                                                arweave,
                                                keyfile,
                                                contractId,
                                                input
                                            ).catch((err) => {
                                                throw err;
                                            });
                                        }
                                        if (tx === undefined) {
                                            alert(`Transaction rejected.`);
                                        } else {
                                            alert(
                                                `Your transaction was successful! Its ID is: ${tx}`
                                            );
                                            setUpdateAddressLegend('updated');
                                            setUpdateAddressButton('button');
                                        }
                                    } catch (error) {
                                        alert(error);
                                    }
                                }}
                            />
                        </li>
                        <li>
                            <input
                                type="reset"
                                value="Reset"
                                onClick={() => {
                                    setUpdate('');
                                    setUpdateAddressLegend('update');
                                    setUpdateAddressButton('button primary');
                                }}
                            />
                        </li>
                    </ul>
                </form>
            </section>
            <section style={{ width: '100%', marginTop: '4%' }}>
                <h4 className="major">Generate a new key</h4>
                <form>
                    <div className="fields">
                        <div className="field half">
                            <select onChange={handleKeyId}>
                                <option value="">Select</option>
                                <option value="ssiComm">
                                    SSI Communication Key
                                </option>
                                <option value="byId">Key by ID</option>
                            </select>
                        </div>

                        {keyId === 'byId' && (
                            <div className="field half">
                                <input
                                    type="text"
                                    placeholder="Key ID"
                                    onChange={handleSpecificId}
                                />
                            </div>
                        )}
                    </div>
                    <ul className="actions">
                        <li>
                            <input
                                type="button"
                                className={newKeyButton}
                                value={sendKey}
                                onClick={async () => {
                                    try {
                                        if (
                                            keyfile === '' &&
                                            arconnect === ''
                                        ) {
                                            throw new Error(
                                                `You have to connect with ArConnect or your keyfile.`
                                            );
                                        }
                                        if (
                                            !account.wallet ||
                                            account.wallet === ''
                                        ) {
                                            throw new Error(
                                                `It seems like you don't have any SSI Permawallet registered.`
                                            );
                                        }
                                        let tx;
                                        if (arconnect !== '') {
                                            let input;
                                            switch (keyId) {
                                                case 'ssiComm':
                                                    {
                                                        const ssiCommKeys =
                                                            await DKMS.generateSsiKeys(
                                                                arweave
                                                            );
                                                        const ssiCommPrivate =
                                                            await DKMS.encryptKey(
                                                                arconnect,
                                                                ssiCommKeys.privateKey
                                                            );
                                                        input = {
                                                            function: 'ssiComm',
                                                            ssicomm:
                                                                ssiCommKeys.publicEncryption,
                                                            key: ssiCommPrivate
                                                        };
                                                    }
                                                    break;
                                                case 'byId':
                                                    {
                                                        const keys =
                                                            await DKMS.generateSsiKeys(
                                                                arweave
                                                            );
                                                        const key =
                                                            await DKMS.encryptKey(
                                                                arconnect,
                                                                keys.privateKey
                                                            );
                                                        input = {
                                                            function:
                                                                'registerKey',
                                                            id: specificId,
                                                            key: key
                                                        };
                                                    }
                                                    break;
                                                default:
                                                    throw new Error(
                                                        'Wrong selection.'
                                                    );
                                            }
                                            tx = await arweave
                                                .createTransaction({
                                                    data: Math.random()
                                                        .toString()
                                                        .slice(-4)
                                                })
                                                .catch((err) => {
                                                    throw err;
                                                });
                                            tx.addTag('Dapp', 'tyron');
                                            tx.addTag(
                                                'App-Name',
                                                'SmartWeaveAction'
                                            );
                                            tx.addTag('App-Version', '0.3.0');
                                            tx.addTag(
                                                'Contract',
                                                account.wallet.toString()
                                            ); // @todo
                                            tx.addTag(
                                                'Input',
                                                JSON.stringify(input)
                                            );

                                            await arweave.transactions
                                                .sign(tx)
                                                .catch((err) => {
                                                    throw err;
                                                });
                                            await arweave.transactions
                                                .post(tx)
                                                .catch((err) => {
                                                    throw err;
                                                });
                                            tx = tx.id;
                                        } else {
                                            const publicEncryption =
                                                await DKMS.generatePublicEncryption(
                                                    keyfile
                                                );
                                            let input;
                                            switch (keyId) {
                                                case 'ssiComm':
                                                    {
                                                        const ssiCommKeys =
                                                            await DKMS.generateSsiKeys(
                                                                arweave
                                                            );
                                                        const ssiCommPrivate =
                                                            await DKMS.encryptData(
                                                                ssiCommKeys.privateKey,
                                                                publicEncryption
                                                            );
                                                        input = {
                                                            function: 'ssiComm',
                                                            ssicomm:
                                                                ssiCommKeys.publicEncryption,
                                                            key: ssiCommPrivate
                                                        };
                                                    }
                                                    break;
                                                case 'byId':
                                                    {
                                                        const keys =
                                                            await DKMS.generateSsiKeys(
                                                                arweave
                                                            );
                                                        const key =
                                                            await DKMS.encryptData(
                                                                keys.privateKey,
                                                                publicEncryption
                                                            );
                                                        input = {
                                                            function:
                                                                'registerKey',
                                                            id: specificId,
                                                            key: key
                                                        };
                                                    }
                                                    break;
                                                default:
                                                    throw new Error(
                                                        'Wrong selection.'
                                                    );
                                            }
                                            tx = await SmartWeave.interactWrite(
                                                arweave,
                                                keyfile,
                                                account.wallet.toString(),
                                                input
                                            ).catch((err) => {
                                                throw err;
                                            });
                                        }
                                        if (tx === undefined) {
                                            alert(
                                                `Transaction still processing.`
                                            );
                                        } else {
                                            alert(
                                                `Your transaction was successful! Its ID is: ${tx}`
                                            );
                                            setSendKey('sent');
                                            setNewKeyButton('button');
                                        }
                                    } catch (error) {
                                        alert(error);
                                    }
                                }}
                            />
                        </li>
                        <li>
                            <input
                                type="reset"
                                value="Reset"
                                onClick={() => {
                                    setKeyId('');
                                    setSendKey('send');
                                    setNewKeyButton('button primary');
                                }}
                            />
                        </li>
                    </ul>
                </form>
            </section>
            <section style={{ width: '100%', marginTop: '4%' }}>
                <h4 className="major">Update your Travel Rule SSI Passport</h4>
                <form>
                    <div className="fields">
                        <div className="field half">
                            <label>First name</label>
                            <input type="text" onChange={handleFirstName} />
                        </div>
                        <div className="field half">
                            <label>Last name</label>
                            <input type="text" onChange={handleLastName} />
                        </div>
                    </div>
                    <section style={{ width: '100%', marginBottom: '3%' }}>
                        <h4>Residential address</h4>
                        <div className="fields">
                            <input
                                type="text"
                                placeholder="Street name"
                                onChange={handleStreetName}
                            />
                        </div>
                    </section>
                    <div className="fields">
                        <div className="field half">
                            <input
                                type="text"
                                placeholder="Building number"
                                onChange={handleBuildingNumber}
                            />
                        </div>
                        <div className="field half">
                            <select onChange={handleCountry}>
                                <option value="">
                                    Select country of residence
                                </option>
                                <option value="Argentina">Argentina</option>
                                <option value="Denmark">Denmark</option>
                                <option value="Singapore">Singapore</option>
                                <option value="United Kingdom">
                                    United Kingdom
                                </option>
                            </select>
                        </div>
                    </div>
                    <ul className="actions">
                        <li>
                            <input
                                type="button"
                                className={savePassportButton}
                                value={savePassportLegend}
                                onClick={() => {
                                    setIvms101({
                                        firstName: firstName,
                                        lastName: lastName,
                                        streetName: streetName,
                                        buildingNumber: buildingNumber,
                                        country: country
                                    });
                                    setSavePassportLegend('Saved');
                                    setSavePassportButton('button');
                                }}
                            />
                        </li>
                        <li>
                            <input
                                type="button"
                                className={updatePassportButton}
                                value={updatePassportLegend}
                                onClick={async () => {
                                    try {
                                        if (
                                            keyfile === '' &&
                                            arconnect === ''
                                        ) {
                                            throw new Error(
                                                `You have to connect with ArConnect or your keyfile.`
                                            );
                                        }
                                        if (savePassportLegend === 'save') {
                                            throw new Error(
                                                'You have to fill up and save the Travel Rule SSI Passport information first.'
                                            );
                                        }

                                        // Travel Rule Passport
                                        const trSsiKeys =
                                            await DKMS.generateSsiKeys(arweave);
                                        const encryptedTrPassport =
                                            await DKMS.encryptData(
                                                ivms101,
                                                trSsiKeys.publicEncryption
                                            );
                                        alert(
                                            `This is your encrypted SSI Travel Rule Passport: ${encryptedTrPassport}`
                                        );

                                        let ssiTravelRulePrivate;
                                        let input;
                                        let tx;
                                        if (arconnect !== '') {
                                            ssiTravelRulePrivate =
                                                await DKMS.encryptKey(
                                                    arconnect,
                                                    trSsiKeys.privateKey
                                                );
                                            input = {
                                                function: 'trp',
                                                trmessage: encryptedTrPassport,
                                                trkey: ssiTravelRulePrivate
                                            };
                                            tx = await arweave
                                                .createTransaction({
                                                    data: Math.random()
                                                        .toString()
                                                        .slice(-4)
                                                })
                                                .catch((err) => {
                                                    throw err;
                                                });
                                            tx.addTag('Dapp', 'tyron');
                                            tx.addTag(
                                                'App-Name',
                                                'SmartWeaveAction'
                                            );
                                            tx.addTag('App-Version', '0.3.0');
                                            tx.addTag(
                                                'Contract',
                                                account.wallet.toString()
                                            );
                                            tx.addTag(
                                                'Input',
                                                JSON.stringify(input)
                                            );

                                            await arweave.transactions
                                                .sign(tx)
                                                .catch((err) => {
                                                    throw err;
                                                });
                                            await arweave.transactions
                                                .post(tx)
                                                .catch((err) => {
                                                    throw err;
                                                });
                                            tx = tx.id;
                                        } else {
                                            const publicEncryption =
                                                await DKMS.generatePublicEncryption(
                                                    keyfile
                                                );
                                            ssiTravelRulePrivate =
                                                await DKMS.encryptData(
                                                    trSsiKeys.privateKey,
                                                    publicEncryption
                                                );
                                            input = {
                                                function: 'trp',
                                                trmessage: encryptedTrPassport,
                                                trkey: ssiTravelRulePrivate
                                            };
                                            tx = await SmartWeave.interactWrite(
                                                arweave,
                                                keyfile,
                                                account.wallet.toString(),
                                                input
                                            ).catch((err) => {
                                                throw err;
                                            });
                                        }
                                        if (tx === undefined) {
                                            alert(`Transaction rejected.`);
                                        } else {
                                            alert(
                                                `Your transaction was successful! Its ID is: ${tx}`
                                            );
                                            setUpdatePassportLegend('updated');
                                            setUpdatePassportButton('button');
                                        }
                                    } catch (error) {
                                        alert(error);
                                    }
                                }}
                            />
                        </li>
                        <li>
                            <input
                                type="reset"
                                value="Reset"
                                onClick={() => {
                                    setIvms101(emptyMessage);
                                    setSavePassportLegend('save');
                                    setSavePassportButton('button primary');
                                    setUpdatePassportLegend('update');
                                    setUpdatePassportButton('button primary');
                                }}
                            />
                        </li>
                    </ul>
                </form>
            </section>
        </div>
    );
}

export default PrivateProfile;
