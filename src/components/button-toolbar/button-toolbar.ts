import { Platform } from 'ionic-angular';
import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
	selector: 'button-toolbar',
	templateUrl: 'button-toolbar.html'
})
export class ButtonToolbar {
	@ViewChild('buttonToolbar') button_toolbar: any;
	private selectedOption: number = 0;

	@Input() toolbarButtons: string[] = [];
	@Input()
	get selected() {
		return this.selectedOption;
	}
	set selected(val) {
		this.selectedOption = val;
		this.slideToolbar();
		this.selectedChange.emit(this.selectedOption);
	}
	@Output() selectedChange = new EventEmitter();

	private ready: boolean = false;

	constructor(
		private platform: Platform
	) {
		platform.ready().then(() => {
			this.ready = true;
		});

		if (this.selectedOption < 0) { this.select(0); }
		if (this.selectedOption > this.toolbarButtons.length - 1) { this.select(this.toolbarButtons.length - 1); }
	}

	public select(index: number): void {
		this.selected = index;
	}

	private slideInterval: any = null;
	private slideToolbar() {
		//If new item not fully in screen, scroll so it is as centered as possible
		if (this.ready) {
			//Clear previous animation
			if (this.slideInterval) {
				clearInterval(this.slideInterval);
				this.slideInterval = null;
			}
			//Get values
			let pager = this.button_toolbar.nativeElement;
			let buttons = pager.children[0].getElementsByTagName('button');
			let curr_button = buttons[this.selectedOption];
			if (curr_button) {
				let wrapper_bb = pager.getBoundingClientRect();
				let button_bb = curr_button.getBoundingClientRect();

				//Animation variables
				let movement_speed = 300;
				let refresh_time = 10;
				let iteration = 0;
				let diff = button_bb.left - ((wrapper_bb.width / 2) - (button_bb.width / 2));

				//Check if diff is out of scroll range and adjust accordingly
				let curr_scroll = pager.scrollLeft;
				if (diff > 0 && diff > (pager.scrollWidth - pager.clientWidth) - curr_scroll) {
					diff = (pager.scrollWidth - pager.clientWidth) - curr_scroll;
				} else if (diff < 0 && diff < -curr_scroll) {
					diff = -curr_scroll;
				}
				//Animate the scroll
				this.slideInterval = setInterval(() => {
					curr_scroll += diff / (movement_speed / refresh_time);
					pager.scrollLeft = curr_scroll;
					iteration++;
					if (iteration >= (movement_speed / refresh_time)) {
						clearInterval(this.slideInterval);
						this.slideInterval = null;
					}
				}, refresh_time);
			}
		}
	}
}
