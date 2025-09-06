import React, { Fragment, useState } from 'react';
import Image from 'next/image';
// import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { getStripe } from '../../lib/stripe';
import { X, Trash2 } from 'lucide-react';
import { useCart } from './CartContext';
import Button from '../ui/Button';

const CartDrawer: React.FC = () => {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, cartTotal, cartCount } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Checkout failed:", error);
      // Optionally, show an error message to the user
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={isCartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggleCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-neutral-900 shadow-xl ring-1 ring-neutral-800">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-card-title font-medium text-white">Shopping Cart</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button type="button" className="relative -m-2 p-2 text-neutral-400 hover:text-white" onClick={toggleCart}>
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {cartCount > 0 ? (
                            <ul role="list" className="-my-6 divide-y divide-neutral-700">
                              {cartItems.map((item) => (
                                <li key={item.beat.title} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                                    <Image src={item.beat.coverArt} alt={item.beat.title} width={96} height={96} />
                                  </div>
                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-white">
                                        <h3>{item.beat.title}</h3>
                                        <p className="ml-4">${item.beat.licenseTypes?.[item.license]?.toFixed(2) || '0.00'}</p>
                                      </div>
                                      <p className="mt-1 text-sm text-neutral-400 uppercase">{item.license} License</p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <button onClick={() => removeFromCart(item.beat.title)} type="button" className="font-medium text-amber hover:text-amber/80 flex items-center gap-1">
                                        <Trash2 className="h-4 w-4" /> Remove
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-center text-neutral-400">Your cart is empty.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-neutral-700 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-white">
                        <p>Subtotal</p>
                        <p>${cartTotal.toFixed(2)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-neutral-500">Shipping and taxes calculated at checkout.</p>
                      <div className="mt-6">
                        <Button onClick={handleCheckout} disabled={cartCount === 0 || loading} className="w-full">
                          {loading ? 'Processing...' : 'Checkout'}
                        </Button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-neutral-500">
                        <p>or <button type="button" className="font-medium text-amber hover:text-amber/80" onClick={toggleCart}>Continue Shopping<span aria-hidden="true"> &rarr;</span></button></p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CartDrawer;