<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Form;
use Illuminate\Support\Facades\Auth;
use Validator;

class FormController extends Controller
{
    //TODO: add jwt 
    // public function __construct()
    // {
    //     $this->middleware('auth:api'); // Apply JWT auth middleware
    // }

    public function save(Request $request)
    {
         //TODO: adding more validation
        $validator = Validator::make($request->all(), [
            'form_name' => 'required|string|max:255',
            'form_data' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $form = new Form();
        $form->form_name = $request->form_name;
        $form->form_data = json_encode($request->form_data);
        $form->save();

        return response()->json(['success' => true, 'data' => $form]);
    }

    public function fetch($id)
    {
        // dd($id);
        // $form = isset($id)? Form::find($id):Form::all();
        // if($id){        
            
        // }
        // // $form = Form::all();
        $form = Form::find($id);

        if (!$form) {
            return response()->json(['message' => 'Form not found'], 404);
        }

        return response()->json($form);
    }

    public function update(Request $request, $id)
    {
        $form = Form::find($id);

        if (!$form) {
            return response()->json(['message' => 'Form not found'], 404);
        }

        //TODO: adding more validation
        $validator = Validator::make($request->all(), [
            'form_name' => 'sometimes|required|string|max:50',
            'form_data' => 'sometimes|required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $form->update($request->only(['form_name', 'form_data']));

        return response()->json(['success' => true, 'data' => $form]);
    }

    public function lists()
    {
        $forms = Form::all();
        return response()->json($forms);
    }
}

