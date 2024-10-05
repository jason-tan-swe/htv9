import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface NFT {
  'getMetadata' : ActorMethod<[], string>,
  'transfer' : ActorMethod<[Principal], boolean>,
}
export interface _SERVICE {
  'getNFTs' : ActorMethod<[], Array<Principal>>,
  'mintNFT' : ActorMethod<[string, Principal, string], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
