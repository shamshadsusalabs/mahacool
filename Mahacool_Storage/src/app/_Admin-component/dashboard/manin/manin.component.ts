import { Component } from '@angular/core';
import { GunnyBagService } from '../../../_Service/gunny-bag.service';
import { WarehouseService } from '../../../_Service/warehouse.service';
import { RackService } from '../../../_Service/rack.service';
import { CitiesService } from '../../../_Service/cities.service';
import { ClientService } from '../../../_Service/client.service';
import { ManagerService } from '../../../_Service/manager.service';

@Component({
  selector: 'app-manin',
  standalone: true,
  imports: [],
  templateUrl: './manin.component.html',
  styleUrl: './manin.component.css'
})
export class ManinComponent {
  totalBoxes :any;
  totalRacks :any;
  totalWarehouses :any;
  totalCity : any;
  totalclient :any;
  totalmanager : any;

  constructor(private gunnyBagService:GunnyBagService, private  warehouseService : WarehouseService, private rackService:RackService,private citiesService:CitiesService,
    private clientService : ClientService, private managerService :ManagerService   ) { }

  ngOnInit(): void {
    this.gunnyBagService.getAllboxes().subscribe((data)=>{
      this.totalBoxes = data
      console.log(this.totalBoxes);

    });

    this.warehouseService.getAllCities().subscribe((data)=>{
      this.totalWarehouses = data
      console.log(this.totalWarehouses);
    });
    this.rackService.getAllRack().subscribe((data)=>{
      this.totalRacks = data;
    })

this.citiesService.getAllCities().subscribe((data)=>{
  this.  totalCity =data

})
    this.clientService.getClients().subscribe((data)=>{
      this.  totalclient = data

    })

    this.managerService.getManager().subscribe((data)=>{
      this.  totalmanager = data

    })
    }
    // Fetch the actual data from a service here
  }


