export const idlFactory = ({ IDL }) => {
  const NFT = IDL.Service({
    'getMetadata' : IDL.Func([], [IDL.Text], ['query']),
    'transfer' : IDL.Func([IDL.Principal], [IDL.Bool], []),
  });
  return IDL.Service({
    'getNFTs' : IDL.Func([], [IDL.Vec(NFT)], ['query']),
    'mintNFT' : IDL.Func([IDL.Text, IDL.Principal, IDL.Text], [NFT], []),
  });
};
export const init = ({ IDL }) => { return []; };
