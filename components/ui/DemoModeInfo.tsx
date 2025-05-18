'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function DemoModeInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center text-blue-500 hover:text-blue-700"
      >
        <InformationCircleIcon className="h-4 w-4 mr-1" />
        <span className="text-xs">À propos du mode démo</span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setIsOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Mode démo vs Mode production
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-3">
                    Lorsque vous travaillez avec Koli55, vous avez le choix entre deux modes de fonctionnement:
                  </p>
                  
                  <h4 className="font-medium text-sm mb-1 text-amber-600">Mode démo</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-500 mb-3">
                    <li>Utilise des données fictives</li>
                    <li>Ne communique pas avec l'API Vapi</li>
                    <li>Les assistants créés ne sont pas visibles dans le tableau de bord Vapi</li>
                    <li>Fonctionne même sans connexion internet</li>
                    <li>Utile pour le développement et les tests d'interface</li>
                  </ul>
                  
                  <h4 className="font-medium text-sm mb-1 text-green-600">Mode production</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-500 mb-3">
                    <li>Communique avec l'API Vapi réelle</li>
                    <li>Les assistants créés sont visibles dans le tableau de bord Vapi</li>
                    <li>Nécessite une connexion internet et des clés API valides</li>
                    <li>Comportement réel de l'application</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Compris
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
} 