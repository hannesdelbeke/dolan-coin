#pragma strict


var itemname : String = " name PLS ";
var description : String = " description PLS ";
private var lockedDescription : String = "";
private var lockedItemname : String = "";
var cost : int =  -1 ; 	
var unlocked : boolean = false;
var bought : boolean = false;
var pickaxe : boolean = false;
var pickaxeBonus : int =  1 ; 	
var consumable : boolean = false;
private var consumed : boolean = false;
var addMineLvl : float =  0 ; 	
var AddToExp : boolean = false;
var addCoin: float =  0 ; 	
var addCoinSpawn: float =  0 ; 	
var addCoinSpeed: float =  0 ; 	

private var lvlmanager : LevelManager;
private var manager : GameObject;

function Start () {
	manager = GameObject.Find("Manager");
	lvlmanager = manager.GetComponent(LevelManager);
	
	lockedDescription = description;
	description = "??????" ;
	lockedItemname = itemname;
	itemname = "??????" ;

	if(cost == -1)
	print("price not set " + gameObject);
	
	if(unlocked)
	{
     		Unlock() ;
	}
}

/*
function Update () {

}
*/
function Unlock(){
	unlocked=true;
	description = lockedDescription ;
	itemname = lockedItemname ;
	transform.GetChild(0).active = false;
}

function Activate(){
	Unlock() ;
	bought=true;
	if(consumable && consumed== false)
	{
	if(AddToExp==false)
		lvlmanager.MineExpBoost += addMineLvl ;
		else
		lvlmanager.MineLevelExp += addMineLvl;
		
		consumed = true;
		
	}
	lvlmanager.CoinBoost += addCoin ;
	lvlmanager.CoinSpawnBoost += addCoinSpawn ;
	lvlmanager.PickupSpeed += addCoinSpeed ;
	
}

