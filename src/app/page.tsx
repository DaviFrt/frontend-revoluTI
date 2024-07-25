'use client'

import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { SearchAddressForm } from '@/components/search-address-form'
import { ChevronRight } from 'lucide-react'
import { Address } from '@/@types/Address'
import axios from 'axios'
import { formatZip } from '@/utils/format-zip'

export default function Home() {
  const [inSessionSearchedAddresses, setInSessionSearchedAddresses] = useState<
    Address[]
  >([])
  const [inStorageSearchedAddresses, setInStorageSearchedAddresses] = useState<
    Address[]
  >([])
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(
    undefined,
  )
  const [isFetchingAddresses, setIsFetchingAddresses] = useState(false)

  function onCreateAddressFormSubmit(addressData: { address: Address }) {
    setInSessionSearchedAddresses((prev) => [addressData.address, ...prev])
  }

  async function fetchStorageSearchedAddresses() {
    setIsFetchingAddresses(true)

    const { data: addresses } = await axios.get<Address[]>(
      'http://localhost:3333/addresses',
    )

    setInStorageSearchedAddresses(addresses)
    setIsFetchingAddresses(false)
  }

  useEffect(() => {
    fetchStorageSearchedAddresses()
  }, [])

  return (
    <main className="w-full max-w-xl h-screen m-auto flex flex-col items-center justify-center">
      <div className="p-6 rounded-lg shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">
          Postal Code & Address Search
        </h1>
        <SearchAddressForm
          onCreateAddressFormSubmit={onCreateAddressFormSubmit}
        />

        <p className="mt-3 text-xs text-center">
          When searching by address, follow the following pattern:
          street/city/state abbreviation (using / to separate the information)
        </p>

        <div className="my-6">
          <h2 className="text-lg font-bold mb-2">Last Search Results</h2>
          {inSessionSearchedAddresses.length > 0 ? (
            inSessionSearchedAddresses.map((address) => (
              <div key={address.id} className="my-3">
                <p className="font-medium">
                  {address.street}, {address.neighborhood}
                </p>
                <p className="text-muted-foreground">
                  {address.city}, {address.state} - {formatZip(address.zip)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No search results yet.</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">Search History</h2>

          {isFetchingAddresses && <p>Loading addresses history...</p>}

          <ul>
            {inStorageSearchedAddresses.length > 0 ? (
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="w-full">
                    {inStorageSearchedAddresses.map((address) => (
                      <li
                        key={address.id}
                        onClick={() => setSelectedAddress(address)}
                        className="p-2 rounded-md flex items-center gap-2"
                      >
                        {<ChevronRight className="size-4" />}
                        {address.street}, {address.city}
                      </li>
                    ))}
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="w-full h-screen fixed top-0 left-0 bg-black/50" />
                  {selectedAddress && (
                    <Dialog.Content className="w-full max-w-md p-6 rounded-lg shadow-lg bg-white top-1/2 fixed left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <Dialog.Title className="mb-4 text-2xl font-bold text-card-foreground">
                        Details for {selectedAddress.street}
                      </Dialog.Title>

                      <div>
                        <p className="font-medium">
                          {selectedAddress.street},{' '}
                          {selectedAddress.neighborhood}
                        </p>
                        <p className="text-muted-foreground">
                          {selectedAddress.city}, {selectedAddress.state} |{' '}
                          {formatZip(selectedAddress.zip)}
                        </p>
                      </div>

                      <div className="w-full flex justify-end">
                        <Dialog.Close
                          onClick={() => setSelectedAddress(undefined)}
                        >
                          <button className="h-10 px-4 py-2 text-sm font-medium rounded-md flex items-center justify-center">
                            Close
                          </button>
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  )}
                </Dialog.Portal>
              </Dialog.Root>
            ) : (
              <p className="text-muted-foreground">No search history yet.</p>
            )}
          </ul>
        </div>
      </div>
    </main>
  )
}
