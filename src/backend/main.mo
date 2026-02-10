import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

actor {
  // Custom Types
  type Beer = {
    id : Nat;
    name : Text;
    style : Text;
    abv : Float;
    ibu : Nat;
    description : Text;
    onTap : Bool;
  };

  // Comparison Function for Beer
  module Beer {
    public func compare(beer1 : Beer, beer2 : Beer) : Order.Order {
      Nat.compare(beer1.id, beer2.id);
    };
  };

  // Persistent Beer Inventory
  let beers = Map.empty<Nat, Beer>();
  var nextId = 0;

  // Add Beer
  public shared ({ caller }) func addBeer(name : Text, style : Text, abv : Float, ibu : Nat, description : Text) : async Nat {
    let beer : Beer = {
      id = nextId;
      name;
      style;
      abv;
      ibu;
      description;
      onTap = true;
    };

    beers.add(nextId, beer);
    nextId += 1;
    nextId - 1;
  };

  // Get All Beers
  public query ({ caller }) func getAllBeers() : async [Beer] {
    beers.values().toArray().sort();
  };

  // Get Beer by ID
  public query ({ caller }) func getBeer(id : Nat) : async Beer {
    switch (beers.get(id)) {
      case (null) { Runtime.trap("Beer not found") };
      case (?beer) { beer };
    };
  };

  // Update Beer
  public shared ({ caller }) func updateBeer(id : Nat, name : Text, style : Text, abv : Float, ibu : Nat, description : Text) : async () {
    switch (beers.get(id)) {
      case (null) { Runtime.trap("Beer not found") };
      case (?existingBeer) {
        let updatedBeer : Beer = {
          id;
          name;
          style;
          abv;
          ibu;
          description;
          onTap = existingBeer.onTap;
        };
        beers.add(id, updatedBeer);
      };
    };
  };

  // Toggle On Tap Status
  public shared ({ caller }) func toggleOnTap(id : Nat) : async () {
    switch (beers.get(id)) {
      case (null) { Runtime.trap("Beer not found") };
      case (?beer) {
        let updatedBeer : Beer = {
          id = beer.id;
          name = beer.name;
          style = beer.style;
          abv = beer.abv;
          ibu = beer.ibu;
          description = beer.description;
          onTap = not beer.onTap;
        };
        beers.add(id, updatedBeer);
      };
    };
  };

  // Remove Beer
  public shared ({ caller }) func removeBeer(id : Nat) : async () {
    if (not beers.containsKey(id)) {
      Runtime.trap("Beer not found");
    };
    beers.remove(id);
  };

  // Get Beers by Status (On Tap or Bottle)
  public query ({ caller }) func getBeersByStatus(onTap : Bool) : async [Beer] {
    let filtered = beers.values().filter(
      func(beer) {
        beer.onTap == onTap;
      }
    );
    filtered.toArray();
  };

  // Get Beers by Style
  public query ({ caller }) func getBeersByStyle(style : Text) : async [Beer] {
    let filtered = beers.values().filter(
      func(beer) {
        beer.style == style;
      }
    );
    filtered.toArray();
  };
};
