import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



persistent actor {
  let accessControlState = AccessControl.initState();
  let products = Map.empty<Nat, Product>();
  let offers = Map.empty<Nat, Offer>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextProductId = 1;
  var storeConfig : StoreConfig = {
    announcement = "Welcome to Smart Ladies Hub!";
    whatsapp = "";
  };

  include MixinStorage();
  include MixinAuthorization(accessControlState);

  public type Product = {
    id : Nat;
    category : Category;
    title : Text;
    icon : Text;
    description : Text;
    badge : ?Text;
    isActive : Bool;
    imageUrl : ?Text;
  };

  public type Category = {
    #ladies;
    #accessories;
    #jewellery;
    #daily;
    #offer;
  };

  public type Offer = {
    id : Nat;
    title : Text;
    description : Text;
    discountText : Text;
    isActive : Bool;
  };

  public type StoreConfig = {
    announcement : Text;
    whatsapp : Text;
  };

  public type StoreDTO = {
    announcement : Text;
    whatsapp : Text;
    activeProducts : [Product];
    offers : [Offer];
  };

  public type UserProfile = {
    name : Text;
  };

  // Check if any admin has been assigned yet (for first-run setup)
  public query func isAdminAssigned() : async Bool {
    AccessControl.isAdminAssigned(accessControlState);
  };

  // Claim admin -- only works if no admin has been assigned yet
  public shared ({ caller }) func claimFirstAdmin() : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be logged in to claim admin");
    };
    AccessControl.claimFirstAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      if (caller != user) {
        Runtime.trap("Unauthorized: Can only view your own profile");
      };
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let id = nextProductId;
    nextProductId += 1;
    products.add(id, { product with id });
    id;
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(id);
  };

  public query ({ caller }) func getProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all products");
    };
    products.values().toArray();
  };

  public shared ({ caller }) func addOffer(offer : Offer) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add offers");
    };
    let id = nextProductId;
    nextProductId += 1;
    offers.add(id, { offer with id });
    id;
  };

  public shared ({ caller }) func updateOffer(offer : Offer) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update offers");
    };
    offers.add(offer.id, offer);
  };

  public shared ({ caller }) func deleteOffer(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete offers");
    };
    offers.remove(id);
  };

  public query ({ caller }) func getOffers() : async [Offer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all offers");
    };
    offers.values().toArray();
  };

  public query ({ caller }) func getActiveProducts() : async [Product] {
    let activeProductsList = List.empty<Product>();

    for (product in products.values()) {
      if (product.isActive) {
        activeProductsList.add(product);
      };
    };
    activeProductsList.toArray();
  };

  public query ({ caller }) func getStoreConfig() : async StoreConfig {
    storeConfig;
  };

  public shared ({ caller }) func updateStoreConfig(config : StoreConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update store config");
    };
    storeConfig := config;
  };

  public query ({ caller }) func getStore() : async StoreDTO {
    let activeProducts = products.values().toArray().filter(func(p) { p.isActive });
    let activeOffers = offers.values().toArray().filter(func(o) { o.isActive });

    {
      announcement = storeConfig.announcement;
      whatsapp = storeConfig.whatsapp;
      activeProducts;
      offers = activeOffers;
    };
  };

  public query ({ caller }) func getCategories() : async [Category] {
    let categories = [#ladies, #accessories, #jewellery, #daily, #offer];
    categories;
  };

  public query ({ caller }) func getStorePublicContent() : async StoreDTO {
    let activeProducts = products.values().toArray().filter(func(p) { p.isActive });
    let activeOffers = offers.values().toArray().filter(func(o) { o.isActive });

    {
      announcement = storeConfig.announcement;
      whatsapp = storeConfig.whatsapp;
      activeProducts;
      offers = activeOffers;
    };
  };

  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    let filteredProductsList = List.empty<Product>();

    for (product in products.values()) {
      if (product.category == category and product.isActive) {
        filteredProductsList.add(product);
      };
    };
    filteredProductsList.toArray();
  };
};
