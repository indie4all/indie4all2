import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);
import { Request, Response } from 'express';

export default {
    get: (req: Request, res: Response) => {

        const json: Object[] = [
            {
                "id": "012aa42db3b146bcb1af554a65b4819f",
                "type": "SingleAnswer",
                "text": "¿El libero es el jugador con mayor respuesta defensiva pero que no puede rematar desde zona de ataque?",
                "answers": [
                    {
                        "text": "Si",
                        "correct": true
                    },
                    {
                        "text": "No",
                        "correct": false
                    },
                    {
                        "text": "Sí defiende  y puede rematar desde cualquier zona",
                        "correct": false
                    }
                ],
                "correct": false,
                "tags": [],
                "group": {
                    "key": "kH778Aa77K",
                    "name": "volei"
                }
            },
            {
                "id": "02aad97eced34051b95abadf38859f31",
                "type": "SingleAnswer",
                "text": "OK",
                "answers": [
                    {
                        "text": "OK",
                        "correct": true
                    },
                    {
                        "text": "OK",
                        "correct": false
                    }
                ],
                "correct": false,
                "tags": [
                    "YES"
                ],
                "group": {
                    "key": "iNLiYzBupQ",
                    "name": "Test"
                }
            },
            {
                "id": "02b64300b88444cc9c3359e84b5cb3a8",
                "type": "MultipleAnswer",
                "text": "El tanteo en voley es:\n3 sets de 25 puntos.\n2 sets de 25 puntos.\n\n",
                "answers": [
                    {
                        "text": "3 sets de 25 puntos.",
                        "correct": true
                    },
                    {
                        "text": "2 sets de 25 puntos.",
                        "correct": false
                    }
                ],
                "correct": false,
                "tags": [],
                "group": {
                    "key": "kH778Aa77K",
                    "name": "volei"
                }
            },
            {
                "id": "02e6621f139f4a74848c4b32f80086c6",
                "type": "TrueFalse",
                "text": "People with low vision always use screen magnification",
                "answers": [],
                "correct": false,
                "tags": [],
                "group": {
                    "key": "MwjzcdzKdL",
                    "name": "Assistive Technology for Visually Impaired"
                }
            },
            {
                "id": "03602ca85fe54078a53c4db68fe4df2a",
                "type": "TrueFalse",
                "text": "Trakai is located in Spain",
                "answers": [],
                "correct": true,
                "tags": [
                    "TEST"
                ],
                "group": {
                    "key": "vLXG2aSJ4o",
                    "name": "Group 1"
                }
            },
            {
                "id": "078719c137454ee6907f48806d610467",
                "type": "TrueFalse",
                "text": "Las necesidades de Maslow se dan de manera simultánea en todos los individuos",
                "answers": [],
                "correct": true,
                "tags": [
                    "Maslow"
                ],
                "group": {
                    "key": "L6qHjgoyex",
                    "name": "Group 1"
                }
            },
            {
                "id": "092b847ac188499185423b71404de2df",
                "type": "SingleAnswer",
                "text": "Las máquinas de corte para metales son:",
                "answers": [
                    {
                        "text": "Radiales y alternativas",
                        "correct": true
                    },
                    {
                        "text": "Alternativas, radiales y de vaivén",
                        "correct": true
                    },
                    {
                        "text": "De cinta, tronzadoras y alternativas",
                        "correct": true
                    },
                    {
                        "text": "De cinta, alternativas, radiales y de vaivén",
                        "correct": true
                    }
                ],
                "correct": false,
                "tags": [
                    "Ténicas básicas de mecanizado"
                ],
                "group": {
                    "key": "eVXIGE21Ph",
                    "name": "Group 1"
                }
            },
            {
                "id": "0be50c249e2947f2a54c006ca634e50c",
                "type": "SingleAnswer",
                "text": "Prueba",
                "answers": [
                    {
                        "text": "Sí",
                        "correct": true
                    },
                    {
                        "text": "No",
                        "correct": false
                    }
                ],
                "correct": false,
                "tags": [],
                "group": {
                    "key": "iNLiYzBupQ",
                    "name": "Test"
                }
            },
            {
                "id": "0d77154ecd9c451ba47cfac53881f0aa",
                "type": "SingleAnswer",
                "text": "Una tuerca remachable nos permite:",
                "answers": [
                    {
                        "text": "Remachar dos o más chapas para que queden juntas y ahorrarnos un tornillo.",
                        "correct": false
                    },
                    {
                        "text": "Colocar una tuerca en una superficie de metal sin calentar y deformar la zona.",
                        "correct": true
                    },
                    {
                        "text": "Remachar la tuerca una vez roscada para asegurar la unión. Es un elemento de seguridad",
                        "correct": false
                    },
                    {
                        "text": "Reparar un orificio roscado ya que esta, sustituye a los filetes dañados.",
                        "correct": false
                    }
                ],
                "correct": false,
                "tags": [
                    "UNIONES ATORNILLADAS"
                ],
                "group": {
                    "key": "WXGCRwrnLR",
                    "name": "Group 1"
                }
            },
            {
                "id": "0dc909c4f14844208c2134db0a0310f9",
                "type": "MultipleAnswer",
                "text": "¿Con qué podemos medir el paso de rosca?",
                "answers": [
                    {
                        "text": "Calibre.",
                        "correct": true
                    },
                    {
                        "text": "Transportador de ángulos.",
                        "correct": false
                    },
                    {
                        "text": "Con la mano.",
                        "correct": false
                    },
                    {
                        "text": "Con un peine de roscas.",
                        "correct": true
                    }
                ],
                "correct": false,
                "tags": [
                    "UNIONES ATORNILLADAS"
                ],
                "group": {
                    "key": "WXGCRwrnLR",
                    "name": "Group 1"
                }
            },
            {
                "id": "0e53418be6944dac9a91c88d5f123eb5",
                "type": "TrueFalse",
                "text": "Las existencias pertenecen al activo de la empresa.",
                "answers": [],
                "correct": true,
                "tags": [
                    "Contabilidad"
                ],
                "group": {
                    "key": "nnrLEYRamx",
                    "name": "Group 1"
                }
            },
            {
                "id": "1127c60a69774f0ab82cd29d54c9ed10",
                "type": "TrueFalse",
                "text": "Use the control key + O to select all the text.",
                "answers": [],
                "correct": false,
                "tags": [],
                "group": {
                    "key": "5tyXrnAPS9",
                    "name": "Hacer accesibles los materiales del aula"
                }
            },
            {
                "id": "149f25abc1b24630bd37576d6e8c3b43",
                "type": "TrueFalse",
                "text": "Για να επιστρέψετε στο προηγούμενο παράθυρο, πατήστε Alt + αριστερό βέλος ή διαφορετικά πατήστε backspace",
                "answers": [],
                "correct": true,
                "tags": [],
                "group": {
                    "key": "38KWU6ziOT",
                    "name": "Touch Typing shortcuts for computer navigation"
                }
            },
            {
                "id": "2e0a0cfeda0847e5b90ed3318a2c6ce4",
                "type": "SingleAnswer",
                "text": "Hola mundo \"ok\"",
                "answers": [
                    {
                        "text": "OK",
                        "correct": true
                    },
                    {
                        "text": "NO",
                        "correct": false
                    }
                ],
                "correct": false,
                "tags": [
                    "YES",
                    "NO"
                ],
                "group": {
                    "key": "iNLiYzBupQ",
                    "name": "Test"
                }
            },
            {
                "id": "c18f9487b92140318e2caee09713829a",
                "type": "MultipleAnswer",
                "text": "Pregunta de prueba múltiple",
                "answers": [
                    {
                        "text": "OK",
                        "correct": true
                    },
                    {
                        "text": "ERROR",
                        "correct": false
                    },
                    {
                        "text": "BIEN",
                        "correct": true
                    }
                ],
                "correct": false,
                "tags": [
                    "prueba",
                    "hola",
                    "adiós"
                ],
                "group": {
                    "key": "iNLiYzBupQ",
                    "name": "Test"
                }
            }
        ]

        res.send(json);
    }
}