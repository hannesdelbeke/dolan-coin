#pragma strict
//code pls

private var ShopActive : boolean = false;
private var MenuActive : boolean = false;
var MuteActive : boolean = false;
private var CreditsActive : boolean = false;

var MineLevel : int = 1; 	//dolan		//SAVE
var MineLevelExp : float = 0;			//SAVE
var MineLevelUpStartExp : float = 10;
var MineLevelUpExp : int = 10;		//SAVE
private var OldMineLevelUpExp : int = 0;		//SAVE

var MineExpBoost : float = 1;
var CoinBoost : float = 1;
var CoinSpawnBoost : float = 1;

var PickupLevel : int = 1; 	//gooby		//SAVE
var PickupLevelExp : float = 0;			//SAVE
var PickupLevelUpStartExp : float = 7;
var PickupLevelUpExp : int = 7;		//SAVE
var OldPickupLevelUpExp : int = 0;		//SAVE

var PickupSpeed : float = 1;
var Depth : float = 0;					//SAVE

var Money : int = 0;					//SAVE

var CoinInterval : int = 10; 	//interval betwwen coins
private var startCoinInterval : int = 10; 	
var CoinTimer : float = 10; 		//counts down till intervall
var maxCoin : int = 5; 			//max amount of 1 coin
var CoinSpeed : float = 10;

private var hit : RaycastHit;
var ray ;

//speed
//var DepthSpeed : float = 1;
var MineSpeed : float = 1;
var LevelUpSpeed : float = 0.2;
var pickaxeBonus : int = 0;

//GameObjs
var Dolan : GameObject ;
private var DolanPos : Vector3 ;
var Coin1 : GameObject ;
var ShopMenu : GameObject ;
var Credits : GameObject ;
var Menu : GameObject ;
var expBarMine : GameObject ;
var expBarPickup : GameObject ;
var cointarget : GameObject ; 

//selectItem in shop
var itemname : String = " name PLS ";
var description : String = " description PLS ";
private var cost : int = -1;
private var SelectedItem : GameObject ;
 var SelectedItemDisplay : GameObject ;
private var currentpage : int = 0; 	 
var Pages_Pickaxe : GameObject[];
var Pages_Upgrade : GameObject[];
var activePickaxe : boolean = true;
var TextStyle : GUIStyle ;
var MoneyStyle :GUIStyle ;
var unknownMat : Material ;

//texture
//var ActiveItem : float = 0.2;

var tempx : float = 0;
var tempy : float = 0;
//sound
//INSERTSOUND
var ButtonSound : AudioClip ;
var BuySound : AudioClip ;
var LevelUpSound : AudioClip ;
var CoinPickupSound : AudioClip ;
//var buttonSound : AudioClip ;
//var buttonSound : AudioClip ;

//unlocks
var exampleUnlock : boolean = false;		//SAVE
var levelexampleUnlock : int = 0;			//SAVE

function Start () 
{ 
	ShopActive = false;
	MenuActive = false;
	//MuteActive = false;
	ShopMenu.active = false;
	if(Menu)
	Menu.active = false;
	startCoinInterval= CoinInterval;
	DolanPos = Dolan.transform.position ;
	
	CoinTimer = Random.value*CoinInterval *(Depth/100+1); // the deeper the longer
}

function Update () {
//	var pickaxeBonus : int = 1;
	PickupSpeed = PickupLevel;
	MineSpeed= 1.0*(pickaxeBonus)/MineLevel  * MineExpBoost ;
	Depth += Time.deltaTime * MineSpeed ; // minespeed depthspeed
	MineLevelExp += Time.deltaTime * MineSpeed ;
	
	if(MineSpeed>0)
	{
	CoinTimer-=Time.deltaTime * CoinSpawnBoost ;
	 }
//	print(MineSpeed);
	expBarMine.transform.localScale = Vector3((MineLevelExp-OldMineLevelUpExp)*1.0/(MineLevelUpExp-OldMineLevelUpExp),1,1) ;
	expBarMine.transform.localPosition.x = (MineLevelExp-OldMineLevelUpExp)*1.0/(MineLevelUpExp-OldMineLevelUpExp)*0.1 - 0.087;
	expBarPickup.transform.localScale = Vector3((PickupLevelExp-OldPickupLevelUpExp)*1.0/(PickupLevelUpExp-OldPickupLevelUpExp),1,1) ;
	expBarPickup.transform.localPosition.x = (PickupLevelExp-OldPickupLevelUpExp)*1.0/(PickupLevelUpExp-OldPickupLevelUpExp)*0.1 - 0.087;
	//spawn coins
	if( CoinTimer<= 0 )
	{
		var tempCoin : GameObject = Instantiate (Coin1, DolanPos, Dolan.transform.rotation);
		var coinamount : int = 1 + Random.value*maxCoin + (Depth/1000) ; // the deeper the more money
		coinamount *= CoinBoost;
		tempCoin.GetComponent(Coin).SetAmount(coinamount ) ; 
		
		if(Random.value <0.3)
		{
			tempCoin = Instantiate (Coin1, DolanPos, Dolan.transform.rotation);
			coinamount = 1 + Random.value*maxCoin + (Depth/1000) ; // the deeper the more money
			coinamount *= CoinBoost;
			tempCoin.GetComponent(Coin).SetAmount(coinamount ) ; 
		}
		if(Depth>1000)
		{
			tempCoin = Instantiate (Coin1, DolanPos, Dolan.transform.rotation);
			coinamount = 1 + Random.value*maxCoin + (Depth/1000) ; // the deeper the more money
			coinamount *= CoinBoost;
			tempCoin.GetComponent(Coin).SetAmount(coinamount ) ; 
		}
		if(Depth>10000)
		{
			tempCoin = Instantiate (Coin1, DolanPos, Dolan.transform.rotation);
			coinamount = 1 + Random.value*maxCoin + (Depth/1000) ; // the deeper the more money
			coinamount *= CoinBoost;
			tempCoin.GetComponent(Coin).SetAmount(coinamount ) ; 
		}
		if(!MuteActive)
		AudioSource.PlayClipAtPoint(CoinPickupSound, new Vector3(0,0,0));
		
		CoinInterval = startCoinInterval/ (Depth/100+1);
		CoinTimer = Random.value*CoinInterval+Random.value ; // the deeper the longer
	}
	
	//grab coins
	var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	if (Physics.Raycast (ray, hit, 1000)) {
       Debug.DrawLine (ray.origin, hit.point);
     	if(hit.collider.tag == "coin" )
     	{
     		var coinam : int = hit.collider.GetComponent(Coin).amount;
     		Money +=coinam ;
     		coinam = coinam/2;
     		if(coinam<=0)coinam=1;
     		AddPickupExp( coinam);
    		Destroy (hit.transform.gameObject);
    		print("ok");
    		
			if(!MuteActive && CoinPickupSound)
			AudioSource.PlayClipAtPoint(CoinPickupSound, new Vector3(0,0,0));
			
    	}
	     if(Input.GetMouseButtonDown(0)) 
	     {
	     	if(activePickaxe)
	    	Pages_Pickaxe[currentpage].active = false;
	    	else
	    	Pages_Upgrade[currentpage].active = false;
	    	
	     	if(hit.collider.tag == "shop" )
	     	{
	     		ShopActive=!ShopActive;
	     		ShopMenu.active = ShopActive;
	     		
				if(!MuteActive && ButtonSound)
				AudioSource.PlayClipAtPoint(ButtonSound, new Vector3(0,0,0));
	     		
	     		MenuActive = false;
	     		Menu.active = MenuActive;
	    	}
	     	if(hit.collider.tag == "credits" )
	     	{
	     		MenuActive =! MenuActive;
	     		Menu.active = MenuActive;
	     		
				if(!MuteActive && ButtonSound)
				AudioSource.PlayClipAtPoint(ButtonSound, new Vector3(0,0,0));
				
	     		CreditsActive=!CreditsActive;
	     		Credits.active = CreditsActive;
	    	}
	    	
	     	if(hit.collider.tag == "menu" )
	     	{
	     		MenuActive =! MenuActive;
	     		Menu.active = MenuActive;
	     		
				if(!MuteActive && ButtonSound)
				AudioSource.PlayClipAtPoint(ButtonSound, new Vector3(0,0,0));
				
	     		ShopActive = false;
	     		ShopMenu.active = ShopActive;
				
	    	}
	     	if(hit.collider.tag == "mute" )
	     	{
	     		MuteActive=!MuteActive;
	     		print("mute");
	     		camera.main.audio.mute = MuteActive;
	    	} 
	     	if(hit.collider.tag == "shopItem" )
	     	{	     	
	     		SelectedItem = hit.collider.gameObject ;
	     		
				if(!MuteActive && ButtonSound)
				AudioSource.PlayClipAtPoint(ButtonSound, new Vector3(0,0,0));
				
	    	}
	     	if(hit.collider.tag == "buy" )
	     	{
	     		var TempShopIcon : ShopIcon = SelectedItem.GetComponent(ShopIcon);
	     		if(cost<=Money && SelectedItem)
	     		{
	     			if(TempShopIcon.bought == false)
	     			{
			     		Money -= cost ;
			     		if(!MuteActive)
						AudioSource.PlayClipAtPoint(BuySound, new Vector3(0,0,0));
			     		TempShopIcon.Activate() ;
	     			}
	     		}
		     	else
		     	{	     		
					if(!MuteActive && ButtonSound)
					AudioSource.PlayClipAtPoint(ButtonSound, new Vector3(0,0,0));
					
	     		}
	     		
				if(TempShopIcon.pickaxe && TempShopIcon.bought)
     			{
     				//equip
     				pickaxeBonus = TempShopIcon.pickaxeBonus ;
     			}
	    	}
	     	if(hit.collider.tag == "next" )
	     	{	     	
	     		currentpage++;
	     		print("next");
				if(!MuteActive && ButtonSound)
				AudioSource.PlayClipAtPoint(ButtonSound, new Vector3(0,0,0));

	    	}
	     	if(hit.collider.tag == "prev" )
	     	{
	     		currentpage--;
	     		if(currentpage<0)
	     		currentpage=0;
	     		print("prev");
				if(!MuteActive && ButtonSound)
				AudioSource.PlayClipAtPoint(ButtonSound, new Vector3(0,0,0));
	    	}
	     	if(hit.collider.tag == "shoptab" )
	     	{	     
	     		activePickaxe = !activePickaxe;
				if(!MuteActive && ButtonSound)
				AudioSource.PlayClipAtPoint(ButtonSound, new Vector3(0,0,0));
	    	}	    	
	    	
	    	//lastpage
	    	var maxlength :int = 0;
			if(activePickaxe)
			maxlength = Pages_Pickaxe.Length;
			else
			maxlength = Pages_Upgrade.Length;
     		if(currentpage>=maxlength)
     		currentpage=maxlength-1;
     		
     		
			if(activePickaxe)
	    	Pages_Pickaxe[currentpage].active = true;
	    	else
	    	Pages_Upgrade[currentpage].active = true;
	    	
	    	if(SelectedItem)
	    	{
	     		var ItemComponent : ShopIcon = SelectedItem.GetComponent(ShopIcon);
	     		itemname = ItemComponent.itemname ;
	     		description = ItemComponent.description ;
	     		cost = ItemComponent.cost ;
	     		if(ItemComponent.unlocked)
	     		SelectedItemDisplay.renderer.material = SelectedItem.renderer.material ;
	     		else
	     		SelectedItemDisplay.renderer.material = unknownMat;
	    	}
	    	
    	}
    }
    
	//minelevel
	if( MineLevelUpExp <= MineLevelExp )
	 {
	 	//print("level " + MineLevel + " exp" + MineLevelExp+ " MineLevelUpExp" + MineLevelUpExp);
	 	//levelup
		MineLevel ++;
	 	//calculöate next exp goal
	 	OldMineLevelUpExp = MineLevelUpExp;
	 	MineLevelUpExp = Mathf.Pow(MineLevelUpStartExp,1+ LevelUpSpeed*MineLevel)+ MineLevel*10; 
		 print(MineLevelUpExp);
		//Level Up Bonusses
		//Money+= 1;
		//Money+= MineLevel;
		
		if(!MuteActive && ButtonSound)
		AudioSource.PlayClipAtPoint(LevelUpSound, new Vector3(0,0,0));
	}
	if( PickupLevelUpExp <= PickupLevelExp )
	 {
	 	//print("level " + PickupLevel + " exp" + PickupLevelExp+ " PickupLevelUpExp" + PickupLevelUpExp);
	 	//levelup
		PickupLevel ++;
	 	//calculöate next exp goal
	 	OldPickupLevelUpExp = PickupLevelUpExp;
	 	PickupLevelUpExp = Mathf.Pow(PickupLevelUpStartExp,1+ LevelUpSpeed*PickupLevel); 
		
		//Level Up Bonusses
		//Money+= 1;
		//Money+= MineLevel;
		
		if(!MuteActive && ButtonSound)
		AudioSource.PlayClipAtPoint(LevelUpSound, new Vector3(0,0,0));
	}
}


function OnGUI ()
{	
	var stringmoney : String = "" + Money +" Ɖ"; 
	var tempcost : String = "";
	if(cost>0)tempcost = ""+cost;
	else
	tempcost = "?????";

	if(ShopActive)
	{
		GUI.Label (Rect (Screen.width * 0.72 ,Screen.height * 0.6 , 160 , 100),itemname , TextStyle);
		GUI.Label (Rect (Screen.width * 0.72 ,Screen.height * 0.65 , 160 , 100),description , TextStyle);
	
		GUI.Label (Rect (Screen.width * 14/20 ,Screen.height *0.48 , 140 , 100),tempcost , MoneyStyle);
	}
			
		GUI.Label (Rect  (Screen.width *0 ,Screen.height  * 0.03  , 140 , 100),"lvl "+MineLevel , TextStyle);
		var depthInt : int = Depth;
		GUI.Label (Rect  (Screen.width *0.7 ,Screen.height  * 0.13  , 140 , 100),"Depth "+ depthInt , TextStyle);
		var currentexp : int = MineLevelExp ;
		GUI.Label (Rect  (Screen.width * 0.2 ,Screen.height  * 0.03  , 140 , 100), currentexp+ "/" +MineLevelUpExp , TextStyle);
		currentexp = PickupLevelExp;
		GUI.Label (Rect  (Screen.width * 0.2 ,Screen.height  * 0.1  , 140 , 100), currentexp+ "/" +PickupLevelUpExp , TextStyle);
		GUI.Label (Rect  (Screen.width * 0 ,Screen.height  * 0.1  , 140 , 100),"lvl "+PickupLevel, TextStyle);
	
	GUI.Label (Rect (Screen.width * 0.5 ,Screen.height  * 0.03 , 140 , 200),stringmoney , MoneyStyle);
	//description
	//itemname
}
function AddPickupExp(exp : float){

PickupLevelExp += exp ;
}
