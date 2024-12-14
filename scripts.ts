
import './collage-images.ts';
import './hidebutton.ts';
import $ from 'jquery';

window.onload = (): void => {
    // Allow for random header image
    $('#footer').load('footer.html');
    $('#header').load('header.html');
    console.log('loading scripts');
};
